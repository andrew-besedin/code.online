import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import UserData from "../interfaces/UserData";
import Room from "../models/Room";
import GetRoomBody from "../interfaces/bodies/GetRoomBody";
import langs from "../constants/langs.json";
import SetLangBody from "../interfaces/bodies/SetLangBody";
import { ROOM_PREFIX } from "../utils/constants";
import { io } from "../server";
import makeid from "../utils/makeid";
import { roomsConnections } from "../shared/rooms-connections";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not provided in .env file");
}

class Controller {

    async register(req: Request, res: Response) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not provided in .env file");
        }        

        const oldToken = req.cookies.token;

        if (oldToken) {
            return res.send({ success: true });  
        }

        const newUser = await User.create({});
        const token = jwt.sign({ id: newUser.dataValues.id }, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.send({ success: true });        
    }

    async createRoom(req: Request, res: Response) {
        const userData = req.body.userData as UserData;
        const hash = makeid(16);
        await Room.create({ owner_id: userData.id, hash });
        res.send({ success: true, data: { hash } });
    }

    async getRoom(req: Request, res: Response) {
        const body = req.body as GetRoomBody;

        const roomRow = await Room.findOne({ where: { hash: body.hash } });

        if (!roomRow) {
            return res.status(200).send({ success: false, error: "Room not found" });
        }

        return res.send({ 
            success: true, 
            data: { 
                id: roomRow.dataValues.id, 
                text: roomRow.dataValues.text,
                lang: roomRow.dataValues.lang,
                isAdmin: roomRow.dataValues.owner_id === body.userData.id
            } 
        });
    }

    async getLangs(req: Request, res: Response) {
        res.send({ success: true, data: { langs } });
    }

    async setLang(req: Request, res: Response) {
        const body = req.body as SetLangBody;

        const roomRow = await Room.findOne({ where: { hash: body.hash } });

        if (!roomRow) {
            return res.status(200).send({ success: false, error: "Room not found" });
        }

        if (roomRow.owner_id !== body.userData.id) {
            return res.status(401).send({ success: false, error: "Unauthorized" });
        }

        const lang = (langs as { [key: string]: string })[body.lang] ? body.lang : null;

        await roomRow.update({ lang: lang });

        io.to(ROOM_PREFIX + roomRow.id).emit("lang-changed", { lang });

        return res.send({ success: true });
    }

    async isOpponentOnline(req: Request, res: Response) {
        const body = req.body as GetRoomBody;

        const roomRow = await Room.findOne({ where: { hash: body.hash } });

        if (!roomRow) {
            return res.status(200).send({ success: false, error: "Room not found" });
        }

        const usersList: ("admin" | "participant")[] = [];

        const currRoomConnections = roomsConnections[roomRow.id];

        if (currRoomConnections) {
            const adminSockets = currRoomConnections[roomRow.owner_id];

            if (adminSockets) {
                for (const socketId of adminSockets || []) {
                    if (!io.sockets.adapter.rooms.get(socketId)?.has(socketId)) {
                        adminSockets.delete(socketId);
                    } else {
                        usersList.push("admin");
                        break;
                    }
                }
            }

            for (const nonAdminId of Object.keys(currRoomConnections).filter(e => e !== roomRow.owner_id)) {
                const nonAdminSockets = currRoomConnections[nonAdminId];

                if (nonAdminSockets) {
                    for (const socketId of nonAdminSockets || []) {
                        if (!io.sockets.adapter.rooms.get(socketId)?.has(socketId)) {
                            nonAdminSockets.delete(socketId);
                        } else {
                            usersList.push("participant");
                            break;
                        }
                    }
                }
            }
        }

        return res.status(200).send({ success: true, data: { participants: usersList } });
    }
}

const controller = new Controller();

export default controller;