import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>LCONN</h1>
        <p style={styles.subtitle}>
          Crowdsourced LEGO Connection Specifications
        </p>
        <p style={styles.description}>
          A collaborative platform where the community defines and votes on
          LEGO connection specifications. Submit specifications, vote on the best ones,
          and help build a comprehensive database of LEGO connections.
        </p>
        <div style={styles.buttons}>
          <Link to="/parts" style={styles.primaryButton}>
            Browse Parts
          </Link>
          <Link to="/parts/create" style={styles.secondaryButton}>
            Create Part
          </Link>
        </div>
      </div>
      <div style={styles.features}>
        <div style={styles.feature}>
          <h3>Community-Driven</h3>
          <p>
            TypeScript type definitions evolve through community pull requests,
            while connection data is stored in a database.
          </p>
        </div>
        <div style={styles.feature}>
          <h3>Vote on Specifications</h3>
          <p>
            Upvote accurate specifications and downvote incorrect ones to surface
            the best definitions.
          </p>
        </div>
        <div style={styles.feature}>
          <h3>Type-Safe</h3>
          <p>
            Shared TypeScript types ensure consistency between frontend and backend,
            catching errors at compile time.
          </p>
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
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  primaryButton: {
    padding: '1rem 2rem',
    backgroundColor: '#0366d6',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
  },
  secondaryButton: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: '#0366d6',
    textDecoration: 'none',
    borderRadius: '4px',
    border: '2px solid #0366d6',
    fontSize: '1.1rem',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '4rem',
    marginBottom: '4rem',
  },
  feature: {
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
};
