import apiClient from './api';

/**
 * Servicio de autenticación
 */

export const authAPI = {
    /**
     * POST /login
     * Autentica un usuario con contraseña
     */
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    /**
     * POST /register
     * Registra un nuevo usuario
     */
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    /**
     * DELETE /login
     * Cierra la sesión
     */
    logout: async () => {
        const response = await apiClient.delete('/auth/login');
        return response.data;
    },

    /**
     * GET /register/exists?email=...
     * Comprueba si existe un usuario para un email dado
     */
    checkEmailExists: async (email) => {
        const response = await apiClient.get('/auth/register/exists', {
            params: { email }
        });
        return response.data;
    },

    /**
     * PUT /register/:userId
     * Actualiza datos del usuario
     */
    updateUser: async (userId, userData) => {
        const response = await apiClient.put(`/auth/register/${userId}`, userData);
        return response.data;
    },

    /**
     * PUT /login/:userId
     * Actualiza la contraseña
     */
    updatePassword: async (userId, currentPassword, newPassword) => {
        const response = await apiClient.put(`/auth/login/${userId}`, {
            currentPassword,
            newPassword,
        });
        return response.data;
    },

    /**
     * POST /login/send-code
     * Envía un código OTP de 4 dígitos al email
     */
    sendOTPCode: async (email) => {
        const response = await apiClient.post('/auth/login/send-code', { email });
        return response.data;
    },

    /**
     * POST /login/verify-code
     * Verifica el código OTP e inicia sesión
     */
    verifyOTPCode: async (email, code) => {
        const response = await apiClient.post('/auth/login/verify-code', { email, code });
        return response.data;
    },
};
