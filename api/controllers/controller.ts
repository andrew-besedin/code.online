import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import UserData from "../interfaces/UserData";
import Room from "../models/Room";

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
}

const controller = new Controller();

export default controller;