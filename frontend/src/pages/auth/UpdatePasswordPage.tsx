import { useState, type FormEvent } from 'react';
import { updatePassword } from '../../api/authApi';
import FormField from '../../components/FormField';
import { validatePassword } from '../../utils/validators';

const UpdatePasswordPage = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    const newErr = validatePassword(form.newPassword);
    if (newErr) e.newPassword = newErr;
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setApiError('');
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      await updatePassword(form.currentPassword, form.newPassword);
      setSuccess('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setApiError(msg || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: 480 }}>
        <h2>Change Password</h2>
        {success && <div className="alert alert-success">{success}</div>}
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <FormField label="Current Password" id="currentPassword" error={errors.currentPassword}>
            <input id="currentPassword" type="password" value={form.currentPassword} onChange={set('currentPassword')} />
          </FormField>
          <FormField label="New Password" id="newPassword" error={errors.newPassword}>
            <input id="newPassword" type="password" value={form.newPassword} onChange={set('newPassword')} placeholder="8-16 chars, 1 uppercase, 1 special char" />
          </FormField>
          <FormField label="Confirm New Password" id="confirmPassword" error={errors.confirmPassword}>
            <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} />
          </FormField>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
