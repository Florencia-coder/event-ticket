import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    apellido: {
        type: DataTypes.STRING,
        allowNull: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    dni: {
        type: DataTypes.STRING,
        allowNull: true
    },

    celular: {
        type: DataTypes.STRING
    },

    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: "users",
    timestamps: true
});

export default User;