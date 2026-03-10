import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const Header = () => {
  const { user, login, logout } = useAuth();

  return (
    <header className="bg-card text-foreground py-4 mb-8">
      <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-foreground no-underline">
          <h1>LCONN</h1>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/parts" className="text-foreground/90 no-underline text-sm">Parts</Link>
          <a
            href={`${API_URL}/api/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/90 no-underline text-sm"
          >
            API Docs
          </a>
        </nav>
        <nav className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-3">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm">{user.name}</span>
              <button onClick={logout} className="px-4 py-2 bg-primary text-primary-foreground border-none rounded cursor-pointer text-sm">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={login} className="px-4 py-2 bg-primary text-primary-foreground border-none rounded cursor-pointer text-sm">
              Login with GitHub
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
