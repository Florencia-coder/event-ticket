import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Uso: const { user, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe estar dentro de AuthProvider');
    }

    return context;
};
