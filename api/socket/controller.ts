import SocketRoomBody from "../interfaces/bodies/SocketRoomBody";
import { Socket } from "socket.io";
import { ROOM_PREFIX } from "../utils/constants";
import SocketChangeTextBody from "../interfaces/bodies/SocketChangeTextBody";
import Room from "../models/Room";
import { io } from "../server";

class SocketController {
    async joinRoom(data: SocketRoomBody, socket: Socket) {
        const { roomId } = data;
        if (!roomId || typeof roomId !== "string") {
            return;
        }
        const roomRow = await Room.findOne({ where: { id: roomId } });
        if (!roomRow) {
            return;
        }
        socket.join(ROOM_PREFIX + roomId);
    }

    async leaveRoom(data: SocketRoomBody, socket: Socket) {
        const { roomId } = data;
        if (!roomId || typeof roomId !== "string") {
            return;
        }
        const roomRow = await Room.findOne({ where: { id: roomId } });
        if (!roomRow) {
            return;
        }
        socket.leave(ROOM_PREFIX + roomId);
    }

    async changeText(data: SocketChangeTextBody, socket: Socket) {
        const { roomId, text } = data;

        if (!roomId || typeof roomId !== "string") {
            return;
        }

        const roomRow = await Room.findOne({ where: { id: roomId } });
        if (!roomRow) {
            return;
        }

        await Room.update({ text }, { where: { id: roomId } });

        io.to(ROOM_PREFIX + roomId).emit("text-changed", { text });
    }
}

const socketController = new SocketController();

export default socketController;