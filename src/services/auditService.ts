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

const FIRESTORE_COLLECTION = 'activity_logs';

export interface ActivityLogInput {
  userId: string;
  role: 'customer' | 'seller' | 'team' | 'admin';
  action: string;
  targetCollection: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity(input: ActivityLogInput): Promise<void> {
  await setDoc(doc(db, FIRESTORE_COLLECTION, `activity_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`), {
    userId: input.userId,
    userRole: input.role,
    actionType: input.action,
    resourceId: input.targetId,
    targetId: input.targetId,
    targetCollection: input.targetCollection,
    targetEntity: input.targetCollection,
    metadata: input.metadata || {},
    timestamp: serverTimestamp(),
  });
}

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

  // Persist directly to the append-only Firestore collection.
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, logId);
    await setDoc(docRef, {
      ...logEntry,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    throw err;
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

  const map = new Map<string, AuditLog>();
  fetchedLogs.forEach((l) => map.set(l.logId, l));
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

        const merged = firestoreLogs.sort(
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
