import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreatePartForm } from '../components/Parts/CreatePartForm';

export const CreatePartPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;

  return (
    <div>
      <CreatePartForm />
    </div>
  );
};
