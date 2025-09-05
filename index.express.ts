import express from "express";
import type { Application, Request, Response } from "express";
import logRequests from "./middlewares/logger.express";
import authRoutes from "./authentication-authorization/auth.express";
import { connect_to_db } from "./middlewares/db.middleware";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequests)

// express auth routes
app.use('/api', connect_to_db, authRoutes)

app.get('/api', (_req: Request, res: Response) => {
    res.send("Hit base url")
})

app.listen(3000, () => {
    console.log("Server listening on 3000");
})