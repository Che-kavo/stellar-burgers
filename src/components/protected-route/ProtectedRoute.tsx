// ProtectedRoute.tsx
import { FC, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProtectedRoute: FC<{
  onlyAuth?: boolean;
  children: React.ReactNode;
}> = memo(({ onlyAuth = false, children }) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((state) => state.auth);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!onlyAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
});
