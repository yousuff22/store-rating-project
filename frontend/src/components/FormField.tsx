interface Props {
  label: string;
  id: string;
  error?: string | null;
  children: React.ReactNode;
}

const FormField = ({ label, id, error, children }: Props) => (
  <div className={`form-field ${error ? 'has-error' : ''}`}>
    <label htmlFor={id}>{label}</label>
    {children}
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default FormField;
