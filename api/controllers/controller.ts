import { Request, Response } from "express";
import User from "../models/User";

class Controller {

    async register(req: Request, res: Response) {
        const newUser = await User.create({});
        console.log(newUser.dataValues);
        res.send({ success: true });        
    }
}

const controller = new Controller();

export default controller;