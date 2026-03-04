import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div style={styles.app}>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#fff',
  },
};

export default App;
