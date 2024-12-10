import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { SortConfig } from '../../hooks/useSort';

interface SortableHeaderProps<T> {
  label: string;
  sortKey: keyof T;
  sortConfig: SortConfig<T>;
  onSort: (key: keyof T) => void;
  className?: string;
}

function SortableHeader<T>({
  label,
  sortKey,
  sortConfig,
  onSort,
  className = ''
}: SortableHeaderProps<T>) {
  const isSorted = sortConfig.key === sortKey;
  
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span className="inline-flex">
          {isSorted ? (
            sortConfig.direction === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </span>
      </div>
    </th>
  );
}

export default SortableHeader;