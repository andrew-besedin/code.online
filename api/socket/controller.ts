import SocketRoomBody from "../interfaces/bodies/SocketRoomBody";
import { Socket } from "socket.io";
import { ROOM_PREFIX } from "../utils/constants";
import SocketChangeTextBody from "../interfaces/bodies/SocketChangeTextBody";
import Room from "../models/Room";

class SocketController {
    async joinRoom(data: SocketRoomBody, socket: Socket) {
        const { hash } = data;
        if (!hash || typeof hash !== "string") {
            return;
        }
        const roomRow = await Room.findOne({ where: { hash } });
        if (!roomRow) {
            return;
        }

        socket.join(ROOM_PREFIX + roomRow.id);
    }

    async leaveRoom(data: SocketRoomBody, socket: Socket) {
        const { hash } = data;
        if (!hash || typeof hash !== "string") {
            return;
        }
        const roomRow = await Room.findOne({ where: { hash } });
        if (!roomRow) {
            return;
        }
        socket.leave(ROOM_PREFIX + roomRow.id);
    }

    async changeText(data: SocketChangeTextBody, socket: Socket) {
        const { hash, text } = data;

        if (!hash || typeof hash !== "string") {
            return;
        }

        const roomRow = await Room.findOne({ where: { hash } });
        if (!roomRow) {
            return;
        }

        await Room.update({ text }, { where: { id: roomRow.id } });

        socket.broadcast.to(ROOM_PREFIX + roomRow.id).emit("text-changed", { text });
    }
}

const socketController = new SocketController();

export default socketController;