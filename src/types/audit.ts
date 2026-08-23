export interface AuditLogEntry {
  id: string;
  action: 'VIEW_GYM';
  gymId: string;
  gymName: string;
  actorName: string;
  actorEmail: string;
  createdAt: string;
}
