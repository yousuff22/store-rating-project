import { useEffect, useState } from 'react';
import { getStores } from '../../api/storesApi';
import { upsertRating } from '../../api/ratingsApi';
import type { Store } from '../../types';
import Table, { type ColumnDef } from '../../components/Table/Table';
import { useTableSort } from '../../hooks/useTableSort';
import StarDisplay from '../../components/StarRating/StarDisplay';
import StarRating from '../../components/StarRating/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserStorePage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [ratingModal, setRatingModal] = useState<{ store: Store } | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState('');

  const { sortField, sortDir, handleSort, sorted } = useTableSort<Store>('name');

  const loadStores = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search.name) params.name = search.name;
    if (search.address) params.address = search.address;
    getStores(params)
      .then((res) => setStores(res.data.data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStores(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); loadStores(); };

  const openRatingModal = (store: Store) => {
    setRatingModal({ store });
    setRatingValue(store.userRating ?? 0);
    setRatingError('');
  };

  const handleSubmitRating = async () => {
    if (!ratingModal || ratingValue < 1) { setRatingError('Please select a rating between 1 and 5.'); return; }
    setRatingLoading(true);
    setRatingError('');
    try {
      await upsertRating(ratingModal.store.id, ratingValue);
      setRatingModal(null);
      loadStores();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setRatingError(msg || 'Failed to submit rating.');
    } finally {
      setRatingLoading(false);
    }
  };

  const columns: ColumnDef<Store>[] = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'avgRating', label: 'Overall Rating', sortable: true, render: (s) => <StarDisplay value={s.avgRating} /> },
    { key: 'userRating', label: 'Your Rating', render: (s) => s.userRating ? <StarDisplay value={s.userRating} /> : <span className="no-rating">Not rated</span> },
    { key: 'id', label: 'Action', render: (s) => (
      <button className="btn btn-sm btn-primary" onClick={() => openRatingModal(s)}>
        {s.userRating ? 'Modify Rating' : 'Rate'}
      </button>
    )},
  ];

  return (
    <div className="page-container">
      <h1>Stores</h1>
      <form className="filter-bar" onSubmit={handleSearch}>
        <input type="text" placeholder="Search by name" value={search.name}
          onChange={(e) => setSearch((p) => ({ ...p, name: e.target.value }))} />
        <input type="text" placeholder="Search by address" value={search.address}
          onChange={(e) => setSearch((p) => ({ ...p, address: e.target.value }))} />
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>

      {loading ? <LoadingSpinner /> : (
        <Table
          columns={columns}
          data={sorted(stores)}
          sortField={sortField as string}
          sortDir={sortDir}
          onSort={(f) => handleSort(f as keyof Store)}
          rowKey={(s) => s.id}
        />
      )}

      {ratingModal && (
        <div className="modal-overlay" onClick={() => setRatingModal(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{ratingModal.store.userRating ? 'Modify Rating' : 'Rate Store'}</h2>
              <button className="modal-close" onClick={() => setRatingModal(null)}>×</button>
            </div>
            <p className="modal-store-name">{ratingModal.store.name}</p>
            <div className="rating-input-wrap">
              <StarRating value={ratingValue} onChange={setRatingValue} />
            </div>
            {ratingError && <div className="alert alert-error">{ratingError}</div>}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setRatingModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmitRating} disabled={ratingLoading}>
                {ratingLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStorePage;
