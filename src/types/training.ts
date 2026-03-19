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
  time: string;
  format: TrainingFormat;
  category: TrainingCategory;
  totalStudents: number;
  factoryAttendance: FactoryAttendance[];
  instructor: string;
  vendor: string;
}

export const FORMAT_LABELS: Record<TrainingFormat, string> = {
  online: 'Online',
  offline: 'Offline',
};

export const CATEGORY_LABELS: Record<TrainingCategory, string> = {
  external: 'Bên ngoài',
  internal: 'Nội bộ',
  inhouse: 'Inhouse',
};
