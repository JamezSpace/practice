import { Request, Response, NextFunction } from "express";
import { error_response } from "../interfaces/response-data.interfaces";
import jsonwebtoken from "jsonwebtoken";

export const validate_auth_request_body = (request: Request, response: Response, next: NextFunction) => {

    // check if nothing is supplied in the request body
    if (typeof request.body === 'undefined')
        return response.status(400).json({
            ...error_response,
            message: "Required fields (email and password) are necessary"
        })


    // check if email is valid using 'gmail' - 5 characters as a standard
    const { email } = request.body;
    if (new String(email).trim().length <= 5)
        return response.status(400).json({
            ...error_response,
            message: "Invalid email!"
        })

    next()
}

export const validate_authorized_user_via_header = (request: Request, response: Response, next: NextFunction) => {

    // extract role from token stored in request header
    // substring(7) returns the entire string beginning from index 7 ("Bearer ") which is the token
    const extracted_token = request.headers["authorization"]?.substring(7)

    console.log("Token", extracted_token);
    next()
}

export const validate_authorized_user_via_http_cookie = (request: Request, response: Response, next: NextFunction) => {

    const extracted_access_token = request.signedCookies.access_token
    let decoded_data;

    try {
        decoded_data = jsonwebtoken.verify(extracted_access_token, process.env.SECRET_KEY || '')

        console.log("Decoded data", decoded_data);
        
        // here verify user's role (RBAC) and/or attribute (ABAC) from the decoded data and return appropriate response
    } catch (error: any) {
        return response.status(401).json({
            ...error_response,
            message: `${error.name}: ${error.message}`
        })
    }

    next()
}