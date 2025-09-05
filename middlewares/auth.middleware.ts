import { Request, Response, NextFunction } from "express";
import { error_response } from "../interfaces/response-data.interfaces";

export const valid_auth_request_body = (request: Request, response: Response, next: NextFunction) => {

    if (typeof request.body === 'undefined')
        return response.status(400).json({
            ...error_response,
            message: "Required fields (email and password) are necessary"
        })


    const { email } = request.body;
    if (new String(email).trim().length <= 5)
        return response.status(400).json({
            ...error_response,
            message: "Invalid email!"
        })

    next()
}