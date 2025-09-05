import { Collection } from "mongodb";
import { client } from "../config/db.config"

class ExpressAuthService {
    users: Collection = client.db('local').collection("practice");

    async userEmailExists(user_email: string): Promise<boolean> {
        if (await this.users.findOne({ email: user_email })) return true;
        return false;
    }

    async addNewUser(user_email: string, hashed_password: string) {
        const new_user = await this.users.insertOne({
            email: user_email,
            password: hashed_password
        })

        return new_user
    }

}

export {
    ExpressAuthService
}