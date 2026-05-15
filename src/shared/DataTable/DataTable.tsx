import React from 'react';
import { Button } from '@/ui/Button';

export interface DataTableColumn<T = any> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  className?: string;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  actions,
  className = '',
}: DataTableProps<T>) => {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="text-center p-5 text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`table-responsive ${className}`}>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.header}
              </th>
            ))}
            {actions && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {safeData.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              style={onRowClick ? { cursor: 'pointer' } : undefined}
            >
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(item)
                    : item[column.key]}
                </td>
              ))}
              {actions && (
                <td onClick={(e) => e.stopPropagation()}>
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

