import { NextFunction, Request, Response } from "express";
import verifyUserData from "../jwt/verifyUserData";


class Middleware {
    verifyUserData(req: Request, res: Response, next: NextFunction) {
        const userData = verifyUserData(req.cookies.token);
        if (!userData) return res.status(401).send({ success: false, error: "Unauthorized" });
        req.body.userData = userData;
        return next();
    }
}

const middleware = new Middleware();

export default middleware;