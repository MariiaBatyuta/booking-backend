import "dotenv/config";
import "./db/db.js";

import express, { json } from "express";
import cors from "cors";
import loginRouter from "./routes/loginRoutes.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use("/api/users", loginRouter);

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