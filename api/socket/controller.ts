import SocketRoomBody from "../interfaces/bodies/SocketRoomBody";
import { Socket } from "socket.io";
import { ROOM_PREFIX } from "../utils/constants";
import SocketChangeTextBody from "../interfaces/bodies/SocketChangeTextBody";
import Room from "../models/Room";
import SocketChangeLangBody from "../interfaces/bodies/SocketChangeLangBody";

class SocketController {
    async joinRoom(data: SocketRoomBody, socket: Socket) {
        try {
            const { roomId } = data;
            if (!roomId || typeof roomId !== "string") {
                return;
            }
            const roomRow = await Room.findOne({ where: { id: roomId } });
            if (!roomRow) {
                return;
            }
    
    
            
            socket.join(ROOM_PREFIX + roomId);
    
            // roomsConnections[socket.id] = {
            //     roomId,
            //     userId: roomRow.dataValues.userId
            // }
    
        } catch(err) {
            console.log("WebSocket error:", err);
        }
       
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

    async changeLang(data: SocketChangeLangBody, socket: Socket) {
        const  { roomId, lang } = data;

        if (!roomId || typeof roomId !== "string") {
            return;
        }

        const roomRow = await Room.findOne({ where: { id: roomId } });
        if (!roomRow) {
            return;
        }
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

        socket.broadcast.to(ROOM_PREFIX + roomId).emit("text-changed", { text });
    }
}

const socketController = new SocketController();

export default socketController;