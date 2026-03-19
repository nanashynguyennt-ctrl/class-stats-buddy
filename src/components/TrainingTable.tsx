import { TrainingRecord, FORMAT_LABELS, CATEGORY_LABELS, calcDuration } from '@/types/training';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
  records: TrainingRecord[];
  factories: string[];
  onEdit: (record: TrainingRecord) => void;
  onDelete: (id: string) => void;
}

const formatBadgeClass: Record<string, string> = {
  online: 'bg-success/20 text-success border-success/30',
  offline: 'bg-warning/20 text-warning border-warning/30',
  eln: 'bg-primary/20 text-primary border-primary/30',
};

const categoryBadgeClass: Record<string, string> = {
  external: 'bg-primary/20 text-primary border-primary/30',
  internal: 'bg-accent/20 text-accent border-accent/30',
  inhouse: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function TrainingTable({ records, factories, onEdit, onDelete }: Props) {
  if (records.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-muted-foreground">
        <p className="font-display text-lg">Chưa có dữ liệu</p>
        <p className="text-sm mt-1">Nhấn "Thêm lớp học" để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">STT</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Tên khóa học</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Ngày</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Thời gian</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Tổng giờ</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Hình thức</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Phân loại</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-right">Tổng HV</TableHead>
              {factories.map(f => (
                <TableHead key={f} className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-right">HV {f}</TableHead>
              ))}
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Giảng viên</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Vendor</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r, i) => (
              <TableRow key={r.id} className="border-border/30 hover:bg-secondary/50 transition-colors">
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">{r.courseName}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.time}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={formatBadgeClass[r.format]}>{FORMAT_LABELS[r.format]}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={categoryBadgeClass[r.category]}>{CATEGORY_LABELS[r.category]}</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">{r.totalStudents}</TableCell>
                {factories.map(f => {
                  const fa = r.factoryAttendance.find(a => a.factoryName === f);
                  return <TableCell key={f} className="text-right">{fa?.count || 0}</TableCell>;
                })}
                <TableCell>{r.instructor}</TableCell>
                <TableCell className="text-muted-foreground">{r.vendor || '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => onEdit(r)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(r.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
