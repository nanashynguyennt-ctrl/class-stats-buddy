import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainingRecord, TrainingFormat, TrainingCategory, FORMAT_LABELS, CATEGORY_LABELS } from '@/types/training';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TrainingRecord, 'id'>) => void;
  factories: string[];
  initial?: TrainingRecord;
}

export function TrainingFormDialog({ open, onClose, onSubmit, factories, initial }: Props) {
  const [form, setForm] = useState({
    courseName: '', date: '', time: '', format: 'offline' as TrainingFormat,
    category: 'internal' as TrainingCategory, totalStudents: 0,
    instructor: '', vendor: '',
    factoryCounts: {} as Record<string, number>,
  });

  useEffect(() => {
    if (initial) {
      const factoryCounts: Record<string, number> = {};
      initial.factoryAttendance.forEach(f => { factoryCounts[f.factoryName] = f.count; });
      setForm({
        courseName: initial.courseName, date: initial.date, time: initial.time,
        format: initial.format, category: initial.category,
        totalStudents: initial.totalStudents, instructor: initial.instructor,
        vendor: initial.vendor, factoryCounts,
      });
    } else {
      setForm({ courseName: '', date: '', time: '', format: 'offline', category: 'internal', totalStudents: 0, instructor: '', vendor: '', factoryCounts: {} });
    }
  }, [initial, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      courseName: form.courseName, date: form.date, time: form.time,
      format: form.format, category: form.category,
      totalStudents: form.totalStudents, instructor: form.instructor,
      vendor: form.vendor,
      factoryAttendance: factories.map(f => ({ factoryName: f, count: form.factoryCounts[f] || 0 })),
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">{initial ? 'Chỉnh sửa' : 'Thêm'} lớp học</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Tên khóa học</Label>
              <Input required value={form.courseName} onChange={e => setForm(p => ({ ...p, courseName: e.target.value }))} />
            </div>
            <div>
              <Label>Ngày</Label>
              <Input type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <Label>Thời gian</Label>
              <Input placeholder="08:00 - 17:00" required value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
            </div>
            <div>
              <Label>Hình thức</Label>
              <Select value={form.format} onValueChange={v => setForm(p => ({ ...p, format: v as TrainingFormat }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(FORMAT_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Phân loại</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v as TrainingCategory }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tổng học viên</Label>
              <Input type="number" min={0} required value={form.totalStudents} onChange={e => setForm(p => ({ ...p, totalStudents: +e.target.value }))} />
            </div>
            <div>
              <Label>Giảng viên</Label>
              <Input required value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))} />
            </div>
            {factories.map(f => (
              <div key={f}>
                <Label>HV {f}</Label>
                <Input type="number" min={0} value={form.factoryCounts[f] || 0} onChange={e => setForm(p => ({ ...p, factoryCounts: { ...p.factoryCounts, [f]: +e.target.value } }))} />
              </div>
            ))}
            <div className="col-span-2">
              <Label>Vendor (nếu có)</Label>
              <Input value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">Lưu</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
