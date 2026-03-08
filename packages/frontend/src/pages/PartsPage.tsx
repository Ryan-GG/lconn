import { PartsTable } from '../components/PartsTable';

export const PartsPage = () => {
  return (
    <div style={styles.container}>
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
};
