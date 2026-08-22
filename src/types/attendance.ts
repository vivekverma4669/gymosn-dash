export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Not Checked In';

export interface AttendanceRow {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  membershipId: string;
  checkInTime: string;
  date: string;
  status: AttendanceStatus;
  trainer: string;
  plan: string;
}
