import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../services/storage';

export function PrivateRoute() {
  if (!getAccessToken()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
