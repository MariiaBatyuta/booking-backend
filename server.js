import "dotenv/config";
import "./db/db.js";

import express, { json } from "express";
import cors from "cors";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import path from "path";

import loginRouter from "./routes/loginRoutes.js";
import infoRouter from "./routes/userInfoRoutes.js";

const server = express();
const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve("./swagger.json"), 'utf-8'));

server.use(cors());
server.use(express.json());

server.use("/api", loginRouter);
server.use("/api/user", infoRouter);

server.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.use((req, res) => {
    res.status(400).send({ message: "Route not found." });
});

server.use((error, req, res, next) => {
    const { status = 500, message = "Server error" } = error;
    res.status(status).send({ message });
});

const port = process.env.PORT || 5001;
server.listen(port, () => {
    console.log(`Server is running. Use API on port: ${port}`);
})