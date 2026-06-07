import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../api/authApi';
import FormField from '../../components/FormField';
import { validateName, validateEmail, validateAddress, validatePassword } from '../../utils/validators';

interface FormErrors { name?: string; email?: string; address?: string; password?: string; }

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    e.name = validateName(form.name) ?? undefined;
    e.email = validateEmail(form.email) ?? undefined;
    e.address = validateAddress(form.address) ?? undefined;
    e.password = validatePassword(form.password) ?? undefined;
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form);
      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: { field: string; message: string }[] } } }).response?.data;
      if (data?.errors) {
        const fe: FormErrors = {};
        data.errors.forEach(({ field, message }) => { (fe as Record<string, string>)[field] = message; });
        setErrors(fe);
      } else {
        setApiError(data?.message || 'Signup failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>StoreRating</h1>
        <h2>Create Account</h2>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <FormField label="Full Name (20–60 characters)" id="name" error={errors.name}>
            <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="Enter your full name" />
          </FormField>
          <FormField label="Email" id="email" error={errors.email}>
            <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
          </FormField>
          <FormField label="Address" id="address" error={errors.address}>
            <input id="address" type="text" value={form.address} onChange={set('address')} placeholder="Your address" />
          </FormField>
          <FormField label="Password" id="password" error={errors.password}>
            <input id="password" type="password" value={form.password} onChange={set('password')} placeholder="8-16 chars, 1 uppercase, 1 special char" />
          </FormField>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default SignupPage;
