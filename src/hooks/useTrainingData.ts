import { useState, useEffect, useCallback } from 'react';
import { TrainingRecord } from '@/types/training';

const STORAGE_KEY = 'training-records';
const FACTORIES_KEY = 'factory-list';

const DEFAULT_FACTORIES = ['TLLT', 'NTL'];

// Rename legacy factory names to the official abbreviations.
const FACTORY_RENAMES: Record<string, string> = {
  'Nhà máy A': 'TLLT',
  'Nhà máy B': 'NTL',
};

function loadSaved<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

export function useTrainingData() {
  const [records, setRecords] = useState<TrainingRecord[]>(() => {
    const loaded = loadSaved<TrainingRecord[]>(STORAGE_KEY, []);
    return loaded.map(r => ({
      ...r,
      factoryAttendance: r.factoryAttendance.map(f => ({
        ...f,
        factoryName: FACTORY_RENAMES[f.factoryName] || f.factoryName,
      })),
    }));
  });

  const [factories, setFactories] = useState<string[]>(() => {
    const loaded = loadSaved<string[]>(FACTORIES_KEY, DEFAULT_FACTORIES);
    return loaded.map(f => FACTORY_RENAMES[f] || f);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(FACTORIES_KEY, JSON.stringify(factories));
  }, [factories]);

  const addRecord = useCallback((record: Omit<TrainingRecord, 'id'>) => {
    setRecords(prev => [...prev, { ...record, id: crypto.randomUUID() }]);
  }, []);

  const updateRecord = useCallback((id: string, record: Omit<TrainingRecord, 'id'>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...record, id } : r));
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  const addFactory = useCallback((name: string) => {
    setFactories(prev => prev.includes(name) ? prev : [...prev, name]);
  }, []);

  const removeFactory = useCallback((name: string) => {
    setFactories(prev => prev.filter(f => f !== name));
  }, []);

  return { records, factories, addRecord, updateRecord, deleteRecord, addFactory, removeFactory };
}
