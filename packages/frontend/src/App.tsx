import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';
import { PartsPage } from './pages/PartsPage';
import { CreatePartPage } from './pages/CreatePartPage';
import { PartDetailPage } from './pages/PartDetailPage';
import { CreateConnectionPage } from './pages/CreateConnectionPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={styles.app}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/parts" element={<PartsPage />} />
              <Route path="/parts/create" element={<CreatePartPage />} />
              <Route path="/parts/:id" element={<PartDetailPage />} />
              <Route path="/parts/:id/connections/create" element={<CreateConnectionPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#fff',
  },
};

export default App;
