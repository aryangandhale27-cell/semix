import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  AuditLog,
  AuditActionType,
  AuditTargetEntity,
  AuditLogChanges,
  AuditLogMetadata,
  AuditLogQueryFilter,
  FieldDiff,
} from '../types/audit';

const AUDIT_STORAGE_KEY = 'semix_activity_logs_v1';
const FIRESTORE_COLLECTION = 'activity_logs';

/**
 * Utility to calculate field-level diffs between old and new state
 */
export function computeFieldDiffs(
  oldObj: Record<string, unknown> | null | undefined,
  newObj: Record<string, unknown> | null | undefined
): { diffs: Record<string, FieldDiff>; affectedFields: string[] } {
  const diffs: Record<string, FieldDiff> = {};
  const before = oldObj || {};
  const after = newObj || {};
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  const IGNORED_KEYS = new Set(['updatedAt', 'timestamp', '_actor', 'lastModified']);

  for (const key of allKeys) {
    if (IGNORED_KEYS.has(key)) continue;

    const oldVal = before[key];
    const newVal = after[key];

    // Deep equality check
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      diffs[key] = {
        oldValue: oldVal === undefined ? null : oldVal,
        newValue: newVal === undefined ? null : newVal,
      };
    }
  }

  return {
    diffs,
    affectedFields: Object.keys(diffs),
  };
}

/**
 * Get local cached logs
 */
export function getLocalAuditLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[AuditService] Failed to read local cache:', err);
    return [];
  }
}

/**
 * Save to local cache
 */
function saveLocalAuditLogs(logs: AuditLog[]) {
  try {
    // Keep max 500 logs locally
    const trimmed = logs.slice(0, 500);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('[AuditService] Failed to save local cache:', err);
  }
}

/**
 * Records an immutable activity log entry across Firestore, backend API, and local state
 */
export async function recordActivityLog(params: {
  userId: string;
  userEmail: string;
  userName?: string;
  userRole: 'admin' | 'seller';
  actionType: AuditActionType;
  targetEntity: AuditTargetEntity;
  targetId: string;
  changes: AuditLogChanges;
  metadata?: Partial<AuditLogMetadata>;
}): Promise<AuditLog> {
  const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const nowIso = new Date().toISOString();

  const fullMetadata: AuditLogMetadata = {
    source: 'web_client',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    route: typeof window !== 'undefined' ? window.location.pathname : undefined,
    ...params.metadata,
  };

  const logEntry: AuditLog = {
    logId,
    timestamp: nowIso,
    userId: params.userId,
    userEmail: params.userEmail,
    userName: params.userName,
    userRole: params.userRole,
    actionType: params.actionType,
    targetEntity: params.targetEntity,
    targetId: params.targetId,
    changes: params.changes,
    metadata: fullMetadata,
  };

  // 1. Save to Local Storage Cache immediately
  const existingLocal = getLocalAuditLogs();
  const updatedLocal = [logEntry, ...existingLocal.filter((l) => l.logId !== logId)];
  saveLocalAuditLogs(updatedLocal);

  // 2. Persist to Firestore activity_logs collection (Append-Only)
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, logId);
    await setDoc(docRef, {
      ...logEntry,
      _firestoreTimestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[AuditService] Firestore write error (fallback to backend):', err);
  }

  // 3. Post to backend server API for persistent archiving in /data/activity-logs.json
  try {
    await fetch('/api/admin/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': params.userRole,
        'x-user-id': params.userId,
      },
      body: JSON.stringify(logEntry),
    });
  } catch (err) {
    console.warn('[AuditService] Server API write error:', err);
  }

  return logEntry;
}

/**
 * Fetches audit logs with filtering support
 */
export async function fetchAuditLogs(
  filter?: AuditLogQueryFilter
): Promise<AuditLog[]> {
  let fetchedLogs: AuditLog[] = [];

  // Try fetching from Firestore first
  try {
    const collRef = collection(db, FIRESTORE_COLLECTION);
    const constraints: any[] = [orderBy('timestamp', 'desc')];

    if (filter?.limit) {
      constraints.push(limit(filter.limit));
    } else {
      constraints.push(limit(100));
    }

    if (filter?.targetEntity && filter.targetEntity !== 'all') {
      constraints.push(where('targetEntity', '==', filter.targetEntity));
    }

    if (filter?.userRole && filter.userRole !== 'all') {
      constraints.push(where('userRole', '==', filter.userRole));
    }

    if (filter?.actionType && filter.actionType !== 'all') {
      constraints.push(where('actionType', '==', filter.actionType));
    }

    const q = query(collRef, ...constraints);
    const snap = await getDocs(q);

    if (!snap.empty) {
      fetchedLogs = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          logId: docSnap.id,
          timestamp: data.timestamp || new Date().toISOString(),
          userId: data.userId || 'unknown',
          userEmail: data.userEmail || '',
          userName: data.userName,
          userRole: data.userRole || 'admin',
          actionType: data.actionType || 'UPDATE',
          targetEntity: data.targetEntity || 'products',
          targetId: data.targetId || '',
          changes: data.changes || { diffs: {}, affectedFields: [] },
          metadata: data.metadata || { source: 'web_client' },
        } as AuditLog;
      });
    }
  } catch (err) {
    console.warn('[AuditService] Firestore fetch failed, trying backend API:', err);
  }

  // Fallback to Express backend if Firestore returned empty or failed
  if (fetchedLogs.length === 0) {
    try {
      const resp = await fetch('/api/admin/audit-logs');
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && Array.isArray(json.data)) {
          fetchedLogs = json.data;
        }
      }
    } catch (err) {
      console.warn('[AuditService] Server API fetch failed:', err);
    }
  }

  // Merge with local storage logs to ensure zero loss
  const localLogs = getLocalAuditLogs();
  const map = new Map<string, AuditLog>();
  [...fetchedLogs, ...localLogs].forEach((l) => map.set(l.logId, l));
  let merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Apply in-memory filters for targetEntity, search, role, etc.
  if (filter) {
    if (filter.targetEntity && filter.targetEntity !== 'all') {
      merged = merged.filter((l) => l.targetEntity === filter.targetEntity);
    }
    if (filter.userRole && filter.userRole !== 'all') {
      merged = merged.filter((l) => l.userRole === filter.userRole);
    }
    if (filter.actionType && filter.actionType !== 'all') {
      merged = merged.filter((l) => l.actionType === filter.actionType);
    }
    if (filter.targetId) {
      merged = merged.filter((l) =>
        l.targetId.toLowerCase().includes(filter.targetId!.toLowerCase())
      );
    }
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      merged = merged.filter(
        (l) =>
          l.userEmail.toLowerCase().includes(q) ||
          (l.userName && l.userName.toLowerCase().includes(q)) ||
          l.targetId.toLowerCase().includes(q) ||
          l.targetEntity.toLowerCase().includes(q) ||
          l.actionType.toLowerCase().includes(q) ||
          (l.changes?.summary && l.changes.summary.toLowerCase().includes(q))
      );
    }
    if (filter.limit) {
      merged = merged.slice(0, filter.limit);
    }
  }

  return merged;
}

/**
 * Real-time subscription to activity logs via Firestore onSnapshot
 */
export function subscribeToAuditLogs(
  onUpdate: (logs: AuditLog[]) => void,
  filter?: AuditLogQueryFilter
): () => void {
  try {
    const collRef = collection(db, FIRESTORE_COLLECTION);
    const q = query(collRef, orderBy('timestamp', 'desc'), limit(filter?.limit || 100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreLogs = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            logId: docSnap.id,
            timestamp: data.timestamp || new Date().toISOString(),
            userId: data.userId || 'unknown',
            userEmail: data.userEmail || '',
            userName: data.userName,
            userRole: data.userRole || 'admin',
            actionType: data.actionType || 'UPDATE',
            targetEntity: data.targetEntity || 'products',
            targetId: data.targetId || '',
            changes: data.changes || { diffs: {}, affectedFields: [] },
            metadata: data.metadata || { source: 'web_client' },
          } as AuditLog;
        });

        const localLogs = getLocalAuditLogs();
        const map = new Map<string, AuditLog>();
        [...firestoreLogs, ...localLogs].forEach((l) => map.set(l.logId, l));
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        onUpdate(merged);
      },
      (error) => {
        console.warn('[AuditService] onSnapshot listener warning:', error);
        // Fallback to fetch on error
        fetchAuditLogs(filter).then(onUpdate).catch(console.error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('[AuditService] Could not establish onSnapshot, polling fallback:', err);
    fetchAuditLogs(filter).then(onUpdate).catch(console.error);
    return () => {};
  }
}
