import { Request, Response } from "express";

class Controller {

    test(req: Request, res: Response) {
        res.send({ success: true });
    }
}

const controller = new Controller();

export default controller;