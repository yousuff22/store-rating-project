const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="loading-container">
    <div className="spinner" />
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
