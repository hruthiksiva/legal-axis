import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import type { ReactNode } from 'react';
import FadeInSection from '../components/animations/FadeInSection';

interface Props {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: Props) => {
  const { admin } = useAdminAuth();
  return (
    <FadeInSection>
      {admin ? children : <Navigate to="/admin" />}
    </FadeInSection>
  );
};

export default ProtectedAdminRoute;


