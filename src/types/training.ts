export type TrainingFormat = 'online' | 'offline' | 'eln';
export type TrainingCategory = 'external' | 'internal' | 'inhouse';

export interface FactoryAttendance {
  factoryName: string;
  count: number;
}

export interface TrainingRecord {
  id: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  format: TrainingFormat;
  category: TrainingCategory;
  totalStudents: number;
  factoryAttendance: FactoryAttendance[];
  instructor: string;
  vendor: string;
}

export function calcDuration(start: string, end: string): string {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
}

export const FORMAT_LABELS: Record<TrainingFormat, string> = {
  online: 'Online',
  offline: 'Offline',
  eln: 'ELN',
};

export const CATEGORY_LABELS: Record<TrainingCategory, string> = {
  external: 'Bên ngoài',
  internal: 'Nội bộ',
  inhouse: 'Inhouse',
};
