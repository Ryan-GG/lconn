import { PartsGrid } from '../components/PartsGrid';

export const PartsPage = () => {
  return (
    <div style={styles.container}>
      <PartsGrid />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
};
