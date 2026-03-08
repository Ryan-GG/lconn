import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const HomePage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>LCONN</h1>
        <p style={styles.subtitle}>
          Crowdsourced LEGO Connection Specifications
        </p>
        <p style={styles.description}>
          Welcome to LCONN. Sign in with GitHub to get started.
        </p>
        <div style={styles.cta}>
          <Link to="/parts" style={styles.ctaButton}>
            Browse Parts
          </Link>
          <a href={`${API_URL}/api/docs`} target="_blank" rel="noopener noreferrer" style={styles.ctaButton}>
            API Docs
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  hero: {
    textAlign: 'center' as const,
    padding: '4rem 0',
  },
  title: {
    fontSize: '4rem',
    margin: '0',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  description: {
    fontSize: '1.1rem',
    color: '#666',
    maxWidth: '800px',
    margin: '2rem auto',
    lineHeight: '1.6',
  },
  cta: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0366d6',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
  } as React.CSSProperties,
  ctaButtonOutline: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#0366d6',
    border: '2px solid #0366d6',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
  } as React.CSSProperties,
};
