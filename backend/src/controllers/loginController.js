import {
    loginUser,
    updateUserPassword
} from "../services/authService.js";

/**
 * POST /login
 * Autentica un usuario y devuelve un token
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await loginUser(email, password);

        res.status(200).json({
            message: "Login exitoso",
            token,
            user
        });

    } catch (error) {
        const statusCode = error.message.includes("no encontrado") || error.message === "Contraseña incorrecta" ? 400 : 500;
        res.status(statusCode).json({
            message: error.message || "Error en login",
            error: error.message
        });
    }
};

/**
 * GET /login
 * Información del endpoint de login
 */
const getLogin = async (req, res) => {
    try {
        res.status(200).json({
            message: "Endpoint GET para login disponible",
            description: "Use POST para iniciar sesión"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error en GET login",
            error: error.message
        });
    }
};

/**
 * DELETE /login
 * Cierra la sesión del usuario
 */
const deleteLogin = async (req, res) => {
    try {
        res.status(200).json({
            message: "Sesión cerrada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al cerrar sesión",
            error: error.message
        });
    }
};

/**
 * PUT/PATCH /login/:userId
 * Actualiza la contraseña del usuario
 */
const updateLogin = async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;

        await updateUserPassword(userId, currentPassword, newPassword);

        res.status(200).json({
            message: "Contraseña actualizada correctamente"
        });
    } catch (error) {
        const statusCode = error.message === "Usuario no encontrado" ? 404 : 400;
        res.status(statusCode).json({
            message: error.message || "Error al actualizar la contraseña",
            error: error.message
        });
    }
};

export { login, getLogin, deleteLogin, updateLogin };
