export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATUS_CHANGE'
  | 'ASSIGNMENT'
  | 'BONUS_ALLOCATION'
  | string;

export type AuditTargetEntity =
  | 'products'
  | 'orders'
  | 'users'
  | 'categories'
  | 'banners'
  | 'coupons'
  | 'seller_bonuses'
  | 'custom_projects';

export interface FieldDiff {
  oldValue: unknown;
  newValue: unknown;
}

export interface AuditLogChanges {
  /** Map of field names to their old and new values */
  diffs: Record<string, FieldDiff>;
  /** Array of top-level field names that were modified */
  affectedFields: string[];
  /** Summary description of change */
  summary?: string;
  /** Full snapshot before the write */
  previousSnapshot?: Record<string, unknown> | null;
  /** Full snapshot after the write */
  newSnapshot?: Record<string, unknown> | null;
}

export interface AuditLogMetadata {
  ipAddress?: string;
  userAgent?: string;
  source: 'web_client' | 'cloud_function' | 'express_api' | 'scheduled_job';
  reason?: string;
  route?: string;
}

export interface AuditLog {
  logId: string;
  timestamp: string; // ISO 8601 string for universal serialization & Firestore Timestamp compatible
  userId: string;
  userEmail: string;
  userName?: string;
  userRole: 'admin' | 'seller' | 'team' | 'customer';
  actionType: AuditActionType;
  targetEntity: AuditTargetEntity;
  targetId: string;
  changes: AuditLogChanges;
  metadata: AuditLogMetadata;
}

export interface AuditLogQueryFilter {
  targetEntity?: AuditTargetEntity | 'all';
  targetId?: string;
  userId?: string;
  userRole?: 'admin' | 'seller' | 'team' | 'customer' | 'all';
  actionType?: AuditActionType | 'all';
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}
