import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">StoreRating</div>
      <div className="navbar-links">
        {user.role === 'ADMIN' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}
        {user.role === 'NORMAL_USER' && (
          <>
            <Link to="/stores">Stores</Link>
            <Link to="/update-password">Change Password</Link>
          </>
        )}
        {user.role === 'STORE_OWNER' && (
          <>
            <Link to="/owner">My Store</Link>
            <Link to="/update-password">Change Password</Link>
          </>
        )}
      </div>
      <div className="navbar-user">
        <span>{user.name.split(' ')[0]}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
