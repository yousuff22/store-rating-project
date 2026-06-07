import { useEffect, useState } from 'react';
import { getUsers, createUser, createAdmin } from '../../api/usersApi';
import type { User, Role } from '../../types';
import Table, { type ColumnDef } from '../../components/Table/Table';
import { useTableSort } from '../../hooks/useTableSort';
import LoadingSpinner from '../../components/LoadingSpinner';
import FormField from '../../components/FormField';
import { validateName, validateEmail, validateAddress, validatePassword } from '../../utils/validators';

interface UserForm { name: string; email: string; address: string; password: string; role: 'NORMAL_USER' | 'STORE_OWNER' | 'ADMIN'; }
interface FormErrors { name?: string; email?: string; address?: string; password?: string; }

const defaultForm: UserForm = { name: '', email: '', address: '', password: '', role: 'NORMAL_USER' };

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<UserForm>(defaultForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formApiError, setFormApiError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });

  const { sortField, sortDir, handleSort, sorted } = useTableSort<User>('name');

  const loadUsers = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    getUsers(params)
      .then((res) => setUsers(res.data.data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); loadUsers(); };

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    e.name = validateName(form.name) ?? undefined;
    e.email = validateEmail(form.email) ?? undefined;
    e.address = validateAddress(form.address) ?? undefined;
    e.password = validatePassword(form.password) ?? undefined;
    setFormErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormApiError('');
    if (!validateForm()) return;
    setFormLoading(true);
    try {
      if (form.role === 'ADMIN') {
        await createAdmin({ name: form.name, email: form.email, address: form.address, password: form.password });
      } else {
        await createUser({ name: form.name, email: form.email, address: form.address, password: form.password, role: form.role });
      }
      setShowModal(false);
      setForm(defaultForm);
      loadUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setFormApiError(msg || 'Failed to create user.');
    } finally {
      setFormLoading(false);
    }
  };

  const columns: ColumnDef<User>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address' },
    { key: 'role', label: 'Role', sortable: true, render: (u) => <span className={`badge badge-${u.role.toLowerCase()}`}>{u.role.replace('_', ' ')}</span> },
    { key: 'storeAvgRating' as keyof User, label: 'Store Rating', render: (u) => u.role === 'STORE_OWNER' ? (u.storeAvgRating != null ? u.storeAvgRating.toFixed(1) + ' ★' : 'No ratings') : '—' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Users</h1>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm(defaultForm); setFormErrors({}); setFormApiError(''); }}>
          + Add User
        </button>
      </div>

      <form className="filter-bar" onSubmit={handleSearch}>
        {['name', 'email', 'address'].map((field) => (
          <input key={field} type="text" placeholder={`Filter by ${field}`} value={(filters as Record<string, string>)[field]}
            onChange={(e) => setFilters((p) => ({ ...p, [field]: e.target.value }))} />
        ))}
        <select value={filters.role} onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}>
          <option value="">All Roles</option>
          {(['ADMIN', 'NORMAL_USER', 'STORE_OWNER'] as Role[]).map((r) => (
            <option key={r} value={r}>{r.replace('_', ' ')}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>

      {loading ? <LoadingSpinner /> : (
        <Table
          columns={columns}
          data={sorted(users)}
          sortField={sortField as string}
          sortDir={sortDir}
          onSort={(f) => handleSort(f as keyof User)}
          rowKey={(u) => u.id}
        />
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add User</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            {formApiError && <div className="alert alert-error">{formApiError}</div>}
            <form onSubmit={handleCreate}>
              <FormField label="Role" id="role">
                <select id="role" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as UserForm['role'] }))}>
                  <option value="NORMAL_USER">Normal User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </FormField>
              <FormField label="Full Name (20–60 chars)" id="uname" error={formErrors.name}>
                <input id="uname" value={form.name} onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setFormErrors((p) => ({ ...p, name: undefined })); }} />
              </FormField>
              <FormField label="Email" id="uemail" error={formErrors.email}>
                <input id="uemail" type="email" value={form.email} onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setFormErrors((p) => ({ ...p, email: undefined })); }} />
              </FormField>
              <FormField label="Address" id="uaddress" error={formErrors.address}>
                <input id="uaddress" value={form.address} onChange={(e) => { setForm((p) => ({ ...p, address: e.target.value })); setFormErrors((p) => ({ ...p, address: undefined })); }} />
              </FormField>
              <FormField label="Password" id="upassword" error={formErrors.password}>
                <input id="upassword" type="password" value={form.password} onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setFormErrors((p) => ({ ...p, password: undefined })); }} placeholder="8-16 chars, 1 uppercase, 1 special char" />
              </FormField>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
