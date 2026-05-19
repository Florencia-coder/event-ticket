/**
 * Validadores para las rutas de autenticación
 */

const validateRegisterInput = (req, res, next) => {
    const { nombre, email, password, celular } = req.body;

    const errors = [];

    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
        errors.push("Nombre es requerido y debe ser un texto válido");
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
        errors.push("Email es requerido y debe ser válido");
    }

    if (!password || password.length < 4) {
        errors.push("Contraseña es requerida y debe tener al menos 4 caracteres");
    }

    if (!celular || typeof celular !== "string" || celular.trim().length === 0) {
        errors.push("Celular es requerido");
    }

    // DNI y fecha_nacimiento son opcionales
    // Se pueden omitir sin problema

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Errores de validación",
            errors
        });
    }

    next();
};

const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;

    const errors = [];

    if (!email || typeof email !== "string" || !email.includes("@")) {
        errors.push("Email es requerido y debe ser válido");
    }

    if (!password || typeof password !== "string" || password.length < 4) {
        errors.push("Contraseña es requerida y debe tener al menos 4 caracteres");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Errores de validación",
            errors
        });
    }

    next();
};

const validateUpdateRegisterInput = (req, res, next) => {
    const { nombre, apellido, email, celular, fecha_nacimiento } = req.body;

    const errors = [];

    if (nombre && (typeof nombre !== "string" || nombre.trim().length === 0)) {
        errors.push("Nombre debe ser un texto válido");
    }

    if (apellido && (typeof apellido !== "string" || apellido.trim().length === 0)) {
        errors.push("Apellido debe ser un texto válido");
    }

    if (email && (typeof email !== "string" || !email.includes("@"))) {
        errors.push("Email debe ser válido");
    }

    if (celular && (typeof celular !== "string" || celular.trim().length === 0)) {
        errors.push("Celular debe ser un texto válido");
    }

    if (fecha_nacimiento && typeof fecha_nacimiento !== "string") {
        errors.push("Fecha de nacimiento debe ser válida");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Errores de validación",
            errors
        });
    }

    next();
};

const validateUpdatePasswordInput = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    const errors = [];

    if (!currentPassword || typeof currentPassword !== "string" || currentPassword.length < 6) {
        errors.push("Contraseña actual es requerida y debe tener al menos 6 caracteres");
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
        errors.push("Nueva contraseña es requerida y debe tener al menos 6 caracteres");
    }

    if (currentPassword === newPassword) {
        errors.push("La nueva contraseña debe ser diferente a la actual");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Errores de validación",
            errors
        });
    }

    next();
};

export {
    validateRegisterInput,
    validateLoginInput,
    validateUpdateRegisterInput,
    validateUpdatePasswordInput
};
