import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';

function App() {
  return (
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
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#fff',
  },
};

export default App;
