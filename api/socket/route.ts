import { Socket } from "socket.io";
import socketController from "./controller";

export default function applySocketRoute(socket: Socket) {

    async function tryCatch(fn: Function) {
        try {
            await fn();
        } catch (err) {
            console.log("WebSocket error:");
            console.error(err);
        }
    }

    socket.on("join-room", (data) => tryCatch(() => socketController.joinRoom(data, socket)));
    socket.on("leave-room", (data) => tryCatch(() => socketController.leaveRoom(data, socket)));
    socket.on("change-text", (data) => tryCatch(() => socketController.changeText(data, socket)));
    
    socket.on("disconnect", () => {
        socket.rooms.forEach(e => {
            socket.leave(e);
        });
    });
}