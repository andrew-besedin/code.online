import { Event, Socket } from "socket.io";
import socketController from "./controller";
import socketMiddlewareRouting from "../middleware/socketMiddlewareRouting";
import verifyUserData from "../jwt/verifyUserData";

export default function applySocketRoute(socket: Socket) {
    async function tryCatch(fn: Function) {
        try {
            await fn();
        } catch (err) {
            console.log("WebSocket error:");
            console.error(err);
        }
    }

    async function verifyToken(event: Event, next: (err?: Error | undefined) => void) {
        const [ path, data ] = event;
    
        const userData = verifyUserData(data.token);
        if (!userData) return next(new Error('Unauthorized'));
    
        event[1].userData = userData;
    
        next();
    }


    socket.use(
        socketMiddlewareRouting(
            verifyToken,
            [
                "join-room",
                "leave-room",
            ]
        )
    )

    socket.on("join-room", (data) => tryCatch(() => socketController.joinRoom(data, socket)));
    socket.on("leave-room", (data) => tryCatch(() => socketController.leaveRoom(data, socket)));
    socket.on("change-text", (data) => tryCatch(() => socketController.changeText(data, socket)));
    
    socket.on("disconnect", () => {
        socket.rooms.forEach(e => {
            socket.leave(e);
        });
    });
}