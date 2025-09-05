import type { Application, NextFunction, Response, Request } from "express";
import { RequestLog } from "../interfaces/requestLog.interface";

const logRequests = async (req: Request, _res: Response, next: NextFunction) => {
    const logInfo: Partial<RequestLog> = {
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        responseSize: req.get("Content-Length") || "unknown"
    }

    console.log(logInfo);
    
    next()
}

export default logRequests;