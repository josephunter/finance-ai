import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export type SortConfig<T> = {
  key: keyof T;
  direction: SortDirection;
};

export function useSort<T>(items: T[], defaultKey: keyof T) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: defaultKey,
    direction: 'desc'
  });

  const sortedItems = useMemo(() => {
    const sortedArray = [...items];
    sortedArray.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (sortConfig.direction === 'asc') {
        return aString.localeCompare(bString);
      }
      return bString.localeCompare(aString);
    });

    return sortedArray;
  }, [items, sortConfig]);

  const requestSort = (key: keyof T) => {
    setSortConfig((currentConfig) => {
      if (currentConfig.key === key) {
        return {
          key,
          direction: currentConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'desc' };
    });
  };

  return { sortedItems, sortConfig, requestSort };
}