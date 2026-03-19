import { TrainingRecord, FORMAT_LABELS, CATEGORY_LABELS, calcDuration } from '@/types/training';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function buildRows(records: TrainingRecord[], factories: string[]) {
  return records.map((r, i) => {
    const row: (string | number)[] = [
      i + 1,
      r.courseName,
      r.date,
      `${r.startTime} - ${r.endTime}`,
      calcDuration(r.startTime, r.endTime),
      FORMAT_LABELS[r.format],
      CATEGORY_LABELS[r.category],
      r.totalStudents,
    ];
    factories.forEach(f => {
      const fa = r.factoryAttendance.find(a => a.factoryName === f);
      row.push(fa ? fa.count : 0);
    });
    row.push(r.instructor, r.vendor || '');
    return row;
  });
}

function buildHeaders(factories: string[]) {
  return [
    'STT', 'Tên khóa học', 'Ngày', 'Thời gian', 'Tổng giờ', 'Hình thức',
    'Phân loại', 'Tổng HV',
    ...factories.map(f => `HV ${f}`),
    'Giảng viên', 'Vendor',
  ];
}

export function exportToExcel(records: TrainingRecord[], factories: string[], month: string) {
  const headers = buildHeaders(factories);
  const rows = buildRows(records, factories);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Auto column widths
  ws['!cols'] = headers.map((h, i) => ({
    wch: Math.max(h.length, ...rows.map(r => String(r[i]).length)) + 2,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf]), `bao-cao-dao-tao-${month}.xlsx`);
}

export function exportToPDF(records: TrainingRecord[], factories: string[], month: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setFontSize(16);
  doc.text(`Báo cáo đào tạo - ${month}`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Tổng số lớp: ${records.length} | Tổng học viên: ${records.reduce((s, r) => s + r.totalStudents, 0)}`, 14, 22);

  const headers = buildHeaders(factories);
  const rows = buildRows(records, factories);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 28,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [100, 80, 180] },
    alternateRowStyles: { fillColor: [240, 240, 255] },
  });

  doc.save(`bao-cao-dao-tao-${month}.pdf`);
}
