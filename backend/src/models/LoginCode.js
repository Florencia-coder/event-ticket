import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * Modelo para almacenar códigos OTP temporales
 * Se eliminan automáticamente cuando expiran
 */
const LoginCode = sequelize.define("LoginCode", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true
    },

    code: {
        type: DataTypes.STRING(4),
        allowNull: false
    },

    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },

    attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    maxAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    }
}, {
    tableName: "login_codes",
    timestamps: true,
    hooks: {
        beforeCreate: (loginCode) => {
            // Establecer expiración en 10 minutos si no está establecida
            if (!loginCode.expiresAt) {
                const expiresAt = new Date();
                expiresAt.setMinutes(expiresAt.getMinutes() + 10);
                loginCode.expiresAt = expiresAt;
            }
        }
    }
});

export default LoginCode;
