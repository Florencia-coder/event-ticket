import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/authService';
import { useAuth as useAuthContext } from './useAuthContext';

/**
 * Hook personalizado para el login
 * Maneja la autenticación del usuario
 */
export const useLogin = () => {
    const { login: loginContext } = useAuthContext();

    return useMutation({
        mutationFn: ({ email, password }) => authAPI.login(email, password),
        onSuccess: (data) => {
            // Guardar en contexto
            if (data.token && data.user) {
                loginContext(data.token, data.user);
            }
        },
        onError: (error) => {
            console.error('Error en login:', error.response?.data?.message);
        },
    });
};

/**
 * Hook personalizado para el registro
 */
export const useRegister = () => {
    const { login: loginContext } = useAuthContext();

    return useMutation({
        mutationFn: (userData) => authAPI.register(userData),
        onSuccess: (data) => {
            // Opcionalmente guardar el token después del registro
            if (data.token && data.user) {
                loginContext(data.token, data.user);
            }
        },
        onError: (error) => {
            console.error('Error en registro:', error.response?.data?.message);
        },
    });
};

/**
 * Hook personalizado para cambiar contraseña
 */
export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: ({ userId, currentPassword, newPassword }) =>
            authAPI.updatePassword(userId, currentPassword, newPassword),
        onError: (error) => {
            console.error('Error al cambiar contraseña:', error.response?.data?.message);
        },
    });
};

/**
 * Hook personalizado para actualizar datos del usuario
 */
export const useUpdateUser = () => {
    return useMutation({
        mutationFn: ({ userId, userData }) =>
            authAPI.updateUser(userId, userData),
        onError: (error) => {
            console.error('Error al actualizar usuario:', error.response?.data?.message);
        },
    });
};

/**
 * Hook personalizado para logout
 */
export const useLogout = () => {
    const { logout: logoutContext } = useAuthContext();

    return useMutation({
        mutationFn: () => authAPI.logout(),
        onSuccess: () => {
            // Limpiar contexto
            logoutContext();
        },
        onError: (error) => {
            console.error('Error al cerrar sesión:', error.response?.data?.message);
        },
    });
};

/**
 * Hook personalizado para enviar código OTP
 */
export const useSendOTPCode = () => {
    return useMutation({
        mutationFn: (email) => authAPI.sendOTPCode(email),
        onError: (error) => {
            console.error('Error al enviar código:', error.response?.data?.message);
        },
    });
};

/**
 * Hook personalizado para verificar código OTP
 */
export const useVerifyOTPCode = () => {
    const { login: loginContext } = useAuthContext();

    return useMutation({
        mutationFn: ({ email, code }) => authAPI.verifyOTPCode(email, code),
        onSuccess: (data) => {
            // Guardar en contexto
            if (data.token && data.user) {
                loginContext(data.token, data.user);
            }
        },
        onError: (error) => {
            console.error('Error al verificar código:', error.response?.data?.message);
        },
    });
};
