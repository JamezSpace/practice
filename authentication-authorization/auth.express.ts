import express from "express";
import bcrypt from "bcrypt";
import type { Router, Request, Response } from "express";
import { ExpressAuthService } from "../services/auth-service.express";
import { error_response, success_response } from "../interfaces/response-data.interfaces";
import { valid_auth_request_body } from "../middlewares/auth.middleware";

const router: Router = express.Router()
const auth_service = new ExpressAuthService()

router.post('/users', valid_auth_request_body, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check if email exists
    if (await auth_service.userEmailExists(email)) return res.status(409).json({
        ...error_response,
        message: "email exists already"
    })

    // hash password
    const ROUND = process.env.ROUND || 10
    const hashed_password = await bcrypt.hash(password, ROUND)

    // save data in the database
    const user = await auth_service.addNewUser(email, hashed_password)
    res.status(201).json({
        ...success_response,
        message: "User Created Successfully",
        data: user
    })

})

export default router