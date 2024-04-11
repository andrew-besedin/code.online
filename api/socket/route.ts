import { Socket } from "socket.io";
import socketController from "./controller";

export default function applySocketRoute(socket: Socket) {
    socket.on("join-room", (data) => socketController.joinRoom(data, socket));
    socket.on("leave-room", (data) => socketController.joinRoom(data, socket));
    socket.on("change-text", (data) => socketController.changeText(data, socket));
    
    socket.on("disconnect", () => {
        socket.rooms.forEach(e => {
            socket.leave(e);
        });
    });
}