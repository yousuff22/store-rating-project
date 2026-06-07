import { useEffect, useState } from 'react';
import { getStores, createStore } from '../../api/storesApi';
import { getUsers } from '../../api/usersApi';
import type { Store, User } from '../../types';
import Table, { type ColumnDef } from '../../components/Table/Table';
import { useTableSort } from '../../hooks/useTableSort';
import StarDisplay from '../../components/StarRating/StarDisplay';
import LoadingSpinner from '../../components/LoadingSpinner';
import FormField from '../../components/FormField';
import { validateName, validateEmail, validateAddress } from '../../utils/validators';

interface StoreForm { name: string; email: string; address: string; ownerId: string; }
interface FormErrors { name?: string; email?: string; address?: string; ownerId?: string; }

const defaultForm: StoreForm = { name: '', email: '', address: '', ownerId: '' };

const AdminStoresPage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [owners, setOwners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<StoreForm>(defaultForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formApiError, setFormApiError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState({ name: '', address: '' });

  const { sortField, sortDir, handleSort, sorted } = useTableSort<Store>('name');

  const loadStores = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    getStores(params)
      .then((res) => setStores(res.data.data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStores();
    getUsers({ role: 'STORE_OWNER' }).then((res) => setOwners(res.data.data ?? []));
  }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); loadStores(); };

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    e.name = validateName(form.name) ?? undefined;
    e.email = validateEmail(form.email) ?? undefined;
    e.address = validateAddress(form.address) ?? undefined;
    if (!form.ownerId) e.ownerId = 'Please select a store owner';
    setFormErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormApiError('');
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      await createStore({ name: form.name, email: form.email, address: form.address, ownerId: parseInt(form.ownerId, 10) });
      setShowModal(false);
      setForm(defaultForm);
      loadStores();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setFormApiError(msg || 'Failed to create store.');
    } finally {
      setFormLoading(false);
    }
  };

  const columns: ColumnDef<Store>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address' },
    { key: 'avgRating', label: 'Avg Rating', sortable: true, render: (s) => <StarDisplay value={s.avgRating} /> },
    { key: 'totalRatings', label: 'Total Ratings' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Stores</h1>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm(defaultForm); setFormErrors({}); setFormApiError(''); }}>
          + Add Store
        </button>
      </div>

      <form className="filter-bar" onSubmit={handleSearch}>
        {['name', 'address'].map((field) => (
          <input key={field} type="text" placeholder={`Filter by ${field}`} value={(filters as Record<string, string>)[field]}
            onChange={(e) => setFilters((p) => ({ ...p, [field]: e.target.value }))} />
        ))}
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Store</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            {formApiError && <div className="alert alert-error">{formApiError}</div>}
            <form onSubmit={handleCreate}>
              <FormField label="Store Name (20–60 chars)" id="sname" error={formErrors.name}>
                <input id="sname" value={form.name} onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setFormErrors((p) => ({ ...p, name: undefined })); }} />
              </FormField>
              <FormField label="Email" id="semail" error={formErrors.email}>
                <input id="semail" type="email" value={form.email} onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setFormErrors((p) => ({ ...p, email: undefined })); }} />
              </FormField>
              <FormField label="Address" id="saddress" error={formErrors.address}>
                <input id="saddress" value={form.address} onChange={(e) => { setForm((p) => ({ ...p, address: e.target.value })); setFormErrors((p) => ({ ...p, address: undefined })); }} />
              </FormField>
              <FormField label="Store Owner" id="sowner" error={formErrors.ownerId}>
                <select id="sowner" value={form.ownerId} onChange={(e) => { setForm((p) => ({ ...p, ownerId: e.target.value })); setFormErrors((p) => ({ ...p, ownerId: undefined })); }}>
                  <option value="">Select a store owner</option>
                  {owners.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
                </select>
              </FormField>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Creating...' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoresPage;
