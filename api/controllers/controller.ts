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

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not provided in .env file");
}

class Controller {

    async register(req: Request, res: Response) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not provided in .env file");
        }        

        const newUser = await User.create({});
        const token = jwt.sign({ id: newUser.dataValues.id }, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.send({ success: true });        
    }

    async createRoom(req: Request, res: Response) {
        const userData = req.body.userData as UserData;
        const newRoom = await Room.create({ owner_id: userData.id });
        res.send({ success: true, data: { id: newRoom.dataValues.id } });
    }

    async getRoom(req: Request, res: Response) {
        const body = req.body as GetRoomBody;

        const room = await Room.findOne({ where: { id: body.roomId } });

        if (!room) {
            return res.status(200).send({ success: false, error: "Room not found" });
        }

        return res.send({ 
            success: true, 
            data: { 
                id: room.dataValues.id, 
                text: room.dataValues.text,
                lang: room.dataValues.lang
            } 
        });
    }

    async getLangs(req: Request, res: Response) {
        res.send({ success: true, data: { langs } });
    }

    async setLang(req: Request, res: Response) {
        const body = req.body as SetLangBody;

        const room = await Room.findOne({ where: { id: body.roomId } });

        if (!room) {
            return res.status(200).send({ success: false, error: "Room not found" });
        }

        const lang = (langs as { [key: string]: string })[body.lang] ? body.lang : null;

        await room.update({ lang: lang });

        io.to(ROOM_PREFIX + body.roomId).emit("lang-changed", { lang });

        return res.send({ success: true });
    }
}

const controller = new Controller();

export default controller;