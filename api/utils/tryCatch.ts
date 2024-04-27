import { Request, Response } from "express";

function tryCatch(fn: (req: Request, res: Response) => Promise<any>) {
    return async function (req: Request, res: Response) {
        try {
            await fn(req, res);
        } catch(err) {
            console.log("Internal error:");
            console.error(err);
            res.status(500).send({ success: false, error: "Internal error" });
        }
    }
}

export default tryCatch;