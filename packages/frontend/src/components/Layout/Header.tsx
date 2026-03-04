import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, login, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <h1>LCONN</h1>
        </Link>
        <nav style={styles.nav}>
          {user ? (
            <div style={styles.userMenu}>
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name}
                  style={styles.avatar}
                />
              )}
              <span style={styles.username}>{user.name}</span>
              <button onClick={logout} style={styles.button}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={login} style={styles.button}>
              Login with GitHub
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#333',
    color: 'white',
    padding: '1rem 0',
    marginBottom: '2rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  username: {
    fontSize: '0.9rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0366d6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};
