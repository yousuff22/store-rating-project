import { useEffect, useState } from 'react';
import { getAdminStats } from '../../api/adminApi';
import type { AdminStats } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="stat-card">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data.data!))
      .catch(() => setError('Failed to load statistics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <StatCard label="Total Users" value={stats!.totalUsers} />
        <StatCard label="Total Stores" value={stats!.totalStores} />
        <StatCard label="Total Ratings" value={stats!.totalRatings} />
      </div>
    </div>
  );
};

export default AdminDashboard;
