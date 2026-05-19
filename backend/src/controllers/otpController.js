import {
    generateAndSendOTP,
    verifyOTPAndLogin
} from "../services/authService.js";

/**
 * POST /login/send-code
 * Genera un código OTP y lo envía al email del usuario
 */
const sendOTPCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes("@")) {
            return res.status(400).json({
                message: "Email inválido"
            });
        }

        await generateAndSendOTP(email);

        res.status(200).json({
            message: "Código enviado al email",
            expiresIn: "10 minutos"
        });

    } catch (error) {
        const statusCode = error.message === "Usuario no encontrado" ? 404 : 500;
        res.status(statusCode).json({
            message: error.message || "Error al enviar el código",
            error: error.message
        });
    }
};

/**
 * POST /login/verify-code
 * Verifica el código OTP e inicia sesión
 */
const verifyOTP = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !email.includes("@")) {
            return res.status(400).json({
                message: "Email inválido"
            });
        }

        if (!code || code.length !== 4) {
            return res.status(400).json({
                message: "Código debe ser de 4 dígitos"
            });
        }

        const { token, user } = await verifyOTPAndLogin(email, code);

        res.status(200).json({
            message: "Login exitoso",
            token,
            user
        });

    } catch (error) {
        const statusCode = error.message === "Usuario no encontrado" ? 404 : 400;
        res.status(statusCode).json({
            message: error.message || "Error al verificar el código",
            error: error.message
        });
    }
};

export { sendOTPCode, verifyOTP };
