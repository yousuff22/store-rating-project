import SortHeader from './SortHeader';
import type { SortDir } from '../../hooks/useTableSort';

export interface ColumnDef<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: ColumnDef<T>[];
  data: T[];
  sortField?: string | null;
  sortDir?: SortDir;
  onSort?: (field: string) => void;
  emptyMessage?: string;
  rowKey: (row: T) => string | number;
}

const Table = <T,>({ columns, data, sortField, sortDir, onSort, emptyMessage = 'No records found', rowKey }: Props<T>) => {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) =>
              col.sortable && onSort ? (
                <SortHeader
                  key={col.key}
                  label={col.label}
                  field={col.key}
                  sortField={sortField ?? null}
                  sortDir={sortDir ?? 'asc'}
                  onSort={onSort}
                />
              ) : (
                <th key={col.key}>{col.label}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-message">{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : String(row[col.key] ?? '—')}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
