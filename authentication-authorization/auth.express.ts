import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import express, { Router, Request, Response } from "express";
import { ExpressAuthService } from "../services/auth-service.express";
import { error_response, success_response } from "../interfaces/response-data.interfaces";
import { validate_auth_request_body, validate_authorized_user_via_header, validate_authorized_user_via_http_cookie } from "../middlewares/auth.middleware";

const router: Router = express.Router()
const auth_service = new ExpressAuthService()

router.post('/signup', validate_auth_request_body, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check if email exists
    if (await auth_service.user_email_exists(email)) return res.status(409).json({
        ...error_response,
        message: "Email exists already"
    })

    // hash password
    const ROUND = process.env.ROUND || 10
    const hashed_password = await bcrypt.hash(password, ROUND)

    // save data in the database
    const user = await auth_service.add_new_user(email, hashed_password)
    res.status(201).json({
        ...success_response,
        message: "User Created Successfully",
        data: user
    })

})

router.post('/login', 
    validate_auth_request_body,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        
        // check if email exists
        if (!await auth_service.user_email_exists(email)) return res.status(401).json({
            ...error_response,
            message: "User email doesn't exist"
        })

        // validate password
        const is_password_valid = await auth_service.validate_password(email, password)
        if(!is_password_valid) return res.status(401).json({
            ...error_response,
            message: "Invalid Credentials!"
        })

        // sign access token and embed in http cookie
        const access_token = jsonwebtoken.sign({
            email: email
        }, process.env.SECRET_KEY || '')


        res.cookie("access_token", access_token, { signed: true, httpOnly: true })
        res.status(200).json({
            ...success_response,
            message: "Login successful!"
        })
})


router.get('/test', validate_authorized_user_via_http_cookie, (req: Request, res: Response) => {
    res.status(200).json({
        ...success_response,
        message: "Welcome to the protected route!"
    })
})

export default router