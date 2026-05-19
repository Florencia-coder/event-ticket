import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import User from "./models/User.js";
import Event from "./models/Event.js";
import Ticket from "./models/Ticket.js";
import LoginCode from "./models/LoginCode.js";
import routes from "./routes/index.js";

User.hasMany(Ticket, {
    foreignKey: "userId"
});

Ticket.belongsTo(User, {
    foreignKey: "userId"
});

Event.hasMany(Ticket, {
    foreignKey: "eventId"
});

Ticket.belongsTo(Event, {
    foreignKey: "eventId"
});

const app = express();

app.use(cors());
app.use(json());
app.use("/", routes);

sequelize.authenticate()
    .then(() => {
        console.log("Conexión a PostgreSQL exitosa");
    })
    .catch((error) => {
        console.error("Error conectando a PostgreSQL:", error);
    }).then(() => {
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log("Modelos sincronizados con la base de datos");
    })
    .catch((error) => {
        console.error("Error sincronizando modelos:", error);
    });

app.get("/", (req, res) => {
    res.send("API TICKET funcionando");
});

export default app;