import { Request, Response, NextFunction } from "express";
import { client } from "../config/db.config";

const connect_to_db = async (request: Request, res: Response, next: NextFunction) => {
    await client.connect()
    
    next()
}

export { connect_to_db }