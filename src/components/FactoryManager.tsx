import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  factories: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

export function FactoryManager({ open, onClose, factories, onAdd, onRemove }: Props) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Quản lý nhà máy</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Tên nhà máy..." value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
            <Button size="icon" onClick={handleAdd} className="gradient-primary text-primary-foreground shrink-0">
              <Plus size={16} />
            </Button>
          </div>
          <div className="space-y-1.5">
            {factories.map(f => (
              <div key={f} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary">
                <span className="text-sm">{f}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onRemove(f)}>
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
