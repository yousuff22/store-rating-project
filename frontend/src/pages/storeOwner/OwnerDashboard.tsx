import { useEffect, useState } from 'react';
import { getMyStore } from '../../api/storesApi';
import type { MyStore, Rater } from '../../types';
import Table, { type ColumnDef } from '../../components/Table/Table';
import { useTableSort } from '../../hooks/useTableSort';
import StarDisplay from '../../components/StarRating/StarDisplay';
import LoadingSpinner from '../../components/LoadingSpinner';

const OwnerDashboard = () => {
  const [store, setStore] = useState<MyStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { sortField, sortDir, handleSort, sorted } = useTableSort<Rater>('name');

  useEffect(() => {
    getMyStore()
      .then((res) => setStore(res.data.data!))
      .catch(() => setError('Could not load your store. Make sure you have been assigned a store by the administrator.'))
      .finally(() => setLoading(false));
  }, []);

  const raterColumns: ColumnDef<Rater>[] = [
    { key: 'name', label: 'User Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true, render: (r) => <StarDisplay value={r.rating} /> },
    { key: 'ratedAt', label: 'Rated On', render: (r) => new Date(r.ratedAt).toLocaleDateString() },
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="page-container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page-container">
      <h1>My Store Dashboard</h1>
      <div className="store-overview card">
        <h2>{store!.name}</h2>
        <p className="store-address">{store!.address}</p>
        <div className="avg-rating-display">
          <span className="avg-label">Average Rating</span>
          {store!.avgRating != null ? (
            <>
              <span className="avg-number">{store!.avgRating.toFixed(1)}</span>
              <StarDisplay value={store!.avgRating} showNumber={false} />
              <span className="avg-count">({store!.raters.length} rating{store!.raters.length !== 1 ? 's' : ''})</span>
            </>
          ) : (
            <span className="no-rating">No ratings yet</span>
          )}
        </div>
      </div>

      <div className="section">
        <h2>Ratings Received</h2>
        <Table
          columns={raterColumns}
          data={sorted(store!.raters)}
          sortField={sortField as string}
          sortDir={sortDir}
          onSort={(f) => handleSort(f as keyof Rater)}
          rowKey={(r) => r.id}
          emptyMessage="No users have rated your store yet."
        />
      </div>
    </div>
  );
};

export default OwnerDashboard;
