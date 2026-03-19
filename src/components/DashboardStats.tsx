import { TrainingRecord, FORMAT_LABELS, CATEGORY_LABELS } from '@/types/training';
import { BookOpen, Users, Monitor, Building2 } from 'lucide-react';

interface Props {
  records: TrainingRecord[];
}

export function DashboardStats({ records }: Props) {
  const totalClasses = records.length;
  const totalStudents = records.reduce((s, r) => s + r.totalStudents, 0);
  const onlineCount = records.filter(r => r.format === 'online').length;
  const offlineCount = records.filter(r => r.format === 'offline').length;

  const byCategory = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    label,
    count: records.filter(r => r.category === key).length,
  }));

  const stats = [
    { icon: BookOpen, label: 'Tổng lớp học', value: totalClasses, color: 'text-primary' },
    { icon: Users, label: 'Tổng học viên', value: totalStudents, color: 'text-accent' },
    { icon: Monitor, label: 'Online', value: onlineCount, color: 'text-success' },
    { icon: Building2, label: 'Offline', value: offlineCount, color: 'text-warning' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map(s => (
        <div key={s.label} className="glass-card p-4 flex items-center gap-3">
          <div className={`p-2.5 rounded-lg bg-secondary ${s.color}`}>
            <s.icon size={20} />
          </div>
          <div>
            <p className="text-2xl font-display font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        </div>
      ))}
      <div className="col-span-2 lg:col-span-4 glass-card p-4 flex gap-6 flex-wrap">
        {byCategory.map(c => (
          <div key={c.label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">{c.label}:</span>
            <span className="font-display font-semibold">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
