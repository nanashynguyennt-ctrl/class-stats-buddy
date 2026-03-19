import { useState, useMemo } from 'react';
import { useTrainingData } from '@/hooks/useTrainingData';
import { DashboardStats } from '@/components/DashboardStats';
import { TrainingTable } from '@/components/TrainingTable';
import { TrainingFormDialog } from '@/components/TrainingFormDialog';
import { FactoryManager } from '@/components/FactoryManager';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { TrainingRecord } from '@/types/training';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileSpreadsheet, FileText, Factory, GraduationCap } from 'lucide-react';

function getMonthOptions() {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= -1; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

export default function Index() {
  const { records, factories, addRecord, updateRecord, deleteRecord, addFactory, removeFactory } = useTrainingData();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | undefined>();
  const [showFactory, setShowFactory] = useState(false);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const filteredRecords = useMemo(() => {
    return records.filter(r => r.date.startsWith(selectedMonth)).sort((a, b) => a.date.localeCompare(b.date));
  }, [records, selectedMonth]);

  const handleEdit = (record: TrainingRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleSubmit = (data: Omit<TrainingRecord, 'id'>) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data);
    } else {
      addRecord(data);
    }
    setEditingRecord(undefined);
  };

  const monthLabel = (() => {
    const [y, m] = selectedMonth.split('-');
    return `Tháng ${parseInt(m)}/${y}`;
  })();

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary">
              <GraduationCap size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">Training Tracker</h1>
              <p className="text-xs text-muted-foreground">Quản lý & thống kê đào tạo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[150px] bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getMonthOptions().map(m => {
                  const [y, mo] = m.split('-');
                  return <SelectItem key={m} value={m}>Tháng {parseInt(mo)}/{y}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <DashboardStats records={filteredRecords} />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display font-semibold text-lg">{monthLabel}</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFactory(true)}>
              <Factory size={14} className="mr-1.5" /> Nhà máy
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportToExcel(filteredRecords, factories, selectedMonth)}>
              <FileSpreadsheet size={14} className="mr-1.5" /> Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportToPDF(filteredRecords, factories, selectedMonth)}>
              <FileText size={14} className="mr-1.5" /> PDF
            </Button>
            <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => { setEditingRecord(undefined); setShowForm(true); }}>
              <Plus size={14} className="mr-1.5" /> Thêm lớp học
            </Button>
          </div>
        </div>

        <TrainingTable records={filteredRecords} factories={factories} onEdit={handleEdit} onDelete={deleteRecord} />
      </main>

      <TrainingFormDialog open={showForm} onClose={() => { setShowForm(false); setEditingRecord(undefined); }} onSubmit={handleSubmit} factories={factories} initial={editingRecord} />
      <FactoryManager open={showFactory} onClose={() => setShowFactory(false)} factories={factories} onAdd={addFactory} onRemove={removeFactory} />
    </div>
  );
}
