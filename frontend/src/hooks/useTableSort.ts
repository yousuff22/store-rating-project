import { useState } from 'react';

export type SortDir = 'asc' | 'desc';

interface UseTableSortReturn<T> {
  sortField: keyof T | null;
  sortDir: SortDir;
  handleSort: (field: keyof T) => void;
  sorted: (data: T[]) => T[];
}

export const useTableSort = <T>(defaultField?: keyof T, defaultDir: SortDir = 'asc'): UseTableSortReturn<T> => {
  const [sortField, setSortField] = useState<keyof T | null>(defaultField ?? null);
  const [sortDir, setSortDir] = useState<SortDir>(defaultDir);

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = (data: T[]): T[] => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  };

  return { sortField, sortDir, handleSort, sorted };
};
