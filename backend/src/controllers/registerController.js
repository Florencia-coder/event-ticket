import {
    registerUser,
    updateUserData,
    deleteUser
} from "../services/authService.js";
import User from "../models/User.js";

/**
 * POST /register
 * Registra un nuevo usuario
 */
const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        console.log("Usuario registrado:", user);
        res.status(201).json({
            message: "Usuario creado correctamente",
            user
        });

    } catch (error) {
        const statusCode = error.message === "El usuario ya existe" ? 400 : 500;
        res.status(statusCode).json({
            message: error.message || "Error en registro",
            error: error.message
        });
    }
};

/**
 * GET /register
 * Información del endpoint de registro
 */
const getRegister = async (req, res) => {
    try {
        res.status(200).json({
            message: "Endpoint GET para registro disponible",
            description: "Use POST para registrar un nuevo usuario"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error en GET register",
            error: error.message
        });
    }
};

/**
 * DELETE /register/:userId
 * Elimina la cuenta de un usuario
 */
const deleteRegister = async (req, res) => {
    try {
        const { userId } = req.params;
        await deleteUser(userId);

        res.status(200).json({
            message: "Cuenta eliminada correctamente"
        });
    } catch (error) {
        const statusCode = error.message === "Usuario no encontrado" ? 404 : 500;
        res.status(statusCode).json({
            message: error.message || "Error al eliminar la cuenta",
            error: error.message
        });
    }
};

/**
 * GET /register/exists?email=...
 * Comprueba si existe una cuenta con ese email
 */
const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                message: 'El email es requerido y debe ser válido'
            });
        }

        const existingUser = await User.findOne({
            where: { email }
        });

        res.status(200).json({
            email,
            exists: !!existingUser
        });
    } catch (error) {
        console.error('Error verificando email:', error);
        res.status(500).json({
            message: 'Error interno al verificar la existencia del email',
            error: error.message
        });
    }
};

/**
 * PUT/PATCH /register/:userId
 * Actualiza los datos del usuario
 */
const updateRegister = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await updateUserData(userId, req.body);

        res.status(200).json({
            message: "Información de registro actualizada",
            user
        });
    } catch (error) {
        const statusCode = error.message === "Usuario no encontrado" ? 404 : 500;
        res.status(statusCode).json({
            message: error.message || "Error al actualizar el registro",
            error: error.message
        });
    }
};

export { register, getRegister, deleteRegister, updateRegister, checkEmailExists };
