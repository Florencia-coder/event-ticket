import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';

/**
 * Componente que protege rutas
 * Solo permite acceso si el usuario está autenticado
 * Si no está autenticado, redirige a login
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <p>Cargando...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
