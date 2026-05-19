import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Event = sequelize.define("Event", {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    imagen: {
        type: DataTypes.STRING
    },
    fecha: {
        type: DataTypes.DATE
    },
    direccion: {
        type: DataTypes.STRING
    },
    ciudad: {
        type: DataTypes.STRING
    },
    precio: {
        type: DataTypes.FLOAT
    },
    cargo: {
        type: DataTypes.FLOAT
    },
    organizador: {
        type: DataTypes.STRING
    },
    latitud: {
        type: DataTypes.FLOAT
    },
    longitud: {
        type: DataTypes.FLOAT
    }
});

export default Event;