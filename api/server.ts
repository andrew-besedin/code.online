import express from "express";
import router from "./routers/route";
import cookieParser from "cookie-parser";
import sequelize from "./sequelize";
import { Server } from "socket.io";
import http from "http";
import applySocketRoute from "./socket/route";
import path from "path";

const PORT = 3033;

const app = express();
const server = http.createServer(app);

const io = new Server(server);
    
(async () => {
    await sequelize.authenticate();
    await sequelize.sync(); 

    io.on("connection", (socket) => {
        applySocketRoute(socket);
    });

    app.use(express.json());
    app.use(express.static(path.resolve(__dirname, "../build")));
    app.use(cookieParser());

    app.use("/api", [ router ]);

    app.get("/*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../build/index.html"));
    });

    server.listen(PORT, () => console.log(`App is listening port ${PORT}`));
})();

export { io };