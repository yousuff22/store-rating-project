import { useState } from 'react';

type FilterState = Record<string, string>;

interface UseTableFilterReturn<T> {
  filters: FilterState;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  filtered: (data: T[]) => T[];
}

export const useTableFilter = <T extends Record<string, unknown>>(
  filterKeys: (keyof T & string)[]
): UseTableFilterReturn<T> => {
  const [filters, setFilters] = useState<FilterState>({});

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({});

  const filtered = (data: T[]): T[] => {
    return data.filter((item) =>
      filterKeys.every((key) => {
        const filterVal = filters[key]?.toLowerCase().trim();
        if (!filterVal) return true;
        const itemVal = String(item[key] ?? '').toLowerCase();
        return itemVal.includes(filterVal);
      })
    );
  };

  return { filters, setFilter, clearFilters, filtered };
};
