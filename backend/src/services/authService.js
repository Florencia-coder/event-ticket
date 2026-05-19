/**
 * Servicios de autenticación
 * Contiene la lógica de negocio separada del controller
 */

import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
import User from "../models/User.js";
import LoginCode from "../models/LoginCode.js";
import { formatUser } from "../utils/formatters.js";
import { sendOTPEmail } from "./emailService.js";

const { sign } = pkg;

/**
 * Registra un nuevo usuario
 */
const registerUser = async (userData) => {
    const { nombre, apellido = null, email, password, dni = null, celular, fecha_nacimiento = null } = userData;
    console.log("Datos recibidos para registro:", userData);
    // Verificar si el usuario ya existe (solo por email)
    const existingUser = await User.findOne({
        where: { email }
    });

    if (existingUser) {
        throw new Error("El usuario ya existe");
    }

    // Hash de la contraseña
    const password_hash = await hash(password, 10);

    // Crear nuevo usuario
    const newUser = await User.create({
        nombre,
        apellido: apellido || null,
        email,
        password_hash,
        dni: dni || null,
        celular,
        fecha_nacimiento: fecha_nacimiento || null
    });

    return formatUser(newUser);
};

/**
 * Autentica un usuario y devuelve un token
 */
const loginUser = async (email, password) => {
    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const isValidPassword = await compare(password, user.password_hash);

    if (!isValidPassword) {
        throw new Error("Contraseña incorrecta");
    }

    const token = sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return {
        token,
        user: formatUser(user)
    };
};

/**
 * Obtiene un usuario por ID
 */
const getUserById = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    return formatUser(user);
};

/**
 * Actualiza datos de un usuario
 */
const updateUserData = async (userId, updateData) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const { nombre, apellido, email, celular, fecha_nacimiento } = updateData;

    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (email) user.email = email;
    if (celular) user.celular = celular;
    if (fecha_nacimiento) user.fecha_nacimiento = fecha_nacimiento;

    await user.save();

    return formatUser(user);
};

/**
 * Actualiza la contraseña de un usuario
 */
const updateUserPassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const isValidPassword = await compare(currentPassword, user.password_hash);

    if (!isValidPassword) {
        throw new Error("Contraseña actual incorrecta");
    }

    const newPasswordHash = await hash(newPassword, 10);
    user.password_hash = newPasswordHash;
    await user.save();

    return {
        message: "Contraseña actualizada correctamente"
    };
};

/**
 * Elimina un usuario
 */
const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    await user.destroy();

    return {
        message: "Cuenta eliminada correctamente"
    };
};

/**
 * Genera un código OTP de 4 dígitos y lo envía al email
 */
const generateAndSendOTP = async (email) => {
    // Verificar que el usuario existe
    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    // Generar código de 4 dígitos
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Calcular expiración (10 minutos desde ahora)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Eliminar códigos anteriores para este email
    await LoginCode.destroy({
        where: { email }
    });

    // Guardar nuevo código con expiración explícita
    await LoginCode.create({
        email,
        code,
        expiresAt
    });

    // Enviar email
    await sendOTPEmail(email, code);

    return {
        message: "Código enviado al email",
        expiresIn: "10 minutos"
    };
};

/**
 * Verifica el código OTP y devuelve un token
 */
const verifyOTPAndLogin = async (email, code) => {
    // Verificar que el usuario existe
    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    // Buscar el código
    const loginCode = await LoginCode.findOne({
        where: { email }
    });

    if (!loginCode) {
        throw new Error("No hay código pendiente. Solicita uno nuevo");
    }

    // Verificar si el código ha expirado
    if (new Date() > new Date(loginCode.expiresAt)) {
        await loginCode.destroy();
        throw new Error("El código ha expirado. Solicita uno nuevo");
    }

    // Verificar si se excedió el número de intentos
    if (loginCode.attempts >= loginCode.maxAttempts) {
        await loginCode.destroy();
        throw new Error("Demasiados intentos. Solicita un código nuevo");
    }

    // Verificar el código
    if (loginCode.code !== code) {
        loginCode.attempts += 1;
        await loginCode.save();
        throw new Error("Código incorrecto");
    }

    // Código correcto, eliminar el registro
    await loginCode.destroy();

    // Generar token
    const token = sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return {
        token,
        user: formatUser(user)
    };
};

export {
    registerUser,
    loginUser,
    getUserById,
    updateUserData,
    updateUserPassword,
    deleteUser,
    generateAndSendOTP,
    verifyOTPAndLogin
};
