import { PartsTable } from '../components/PartsTable';

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
      </div>
      <PartsTable />
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
};
