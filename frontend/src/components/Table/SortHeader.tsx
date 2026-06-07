import type { SortDir } from '../../hooks/useTableSort';

interface Props {
  label: string;
  field: string;
  sortField: string | null;
  sortDir: SortDir;
  onSort: (field: string) => void;
}

const SortHeader = ({ label, field, sortField, sortDir, onSort }: Props) => {
  const isActive = sortField === field;
  return (
    <th onClick={() => onSort(field)} className="sort-header" style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      {label}{' '}
      <span style={{ opacity: isActive ? 1 : 0.3 }}>
        {isActive ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </th>
  );
};

export default SortHeader;
