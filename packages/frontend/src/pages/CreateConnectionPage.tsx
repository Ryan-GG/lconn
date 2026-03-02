import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreateConnectionForm } from '../components/Connections/CreateConnectionForm';

export const CreateConnectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to={`/parts/${id}`} />;

  return (
    <div>
      <CreateConnectionForm partId={id!} />
    </div>
  );
};
