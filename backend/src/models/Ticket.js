import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Ticket = sequelize.define("Ticket", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Events",
            key: "id"
        }
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    qrData: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },

    status: {
        type: DataTypes.ENUM("active", "used", "expired"),
        defaultValue: "active"
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    whatsapp: {
        type: DataTypes.STRING
    },

    email: {
        type: DataTypes.STRING
    },

    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },

    codigo_ticket: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    estado: {
        type: DataTypes.STRING,
        defaultValue: "pendiente"
    },

    tipo_ticket: {
        type: DataTypes.STRING
    },

    fecha_compra: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    tableName: "tickets",
    timestamps: true
});

export default Ticket;