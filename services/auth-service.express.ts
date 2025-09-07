import { Collection } from "mongodb";
import bcrypt from "bcrypt";
import { client } from "../config/db.config"

class ExpressAuthService {
    users: Collection = client.db('local').collection("practice");

    async user_email_exists(user_email: string): Promise<boolean> {
        if (await this.users.findOne({ email: user_email })) return true;
        return false;
    }

    async add_new_user(user_email: string, hashed_password: string) {
        const new_user = await this.users.insertOne({
            email: user_email,
            password: hashed_password
        })

        return new_user
    }

    async validate_password(user_email: string, user_password: string): Promise<Boolean> {
        
        // find user stored password hash in db
        const user = await this.users.findOne({
            email: user_email
        })

        // user looks like { 
        //  _id: new ObjectId('68baf7add59372532d4314f7'),
        //  email: 'test@gmail.com', 
        //  password: '$2b$10$NBzsc0f.hhmGBAZ1xINyvOqC.9WfEKvwHamGeerrtCBkMsqWmy0WK'
        // }
        const extracted_password = user?.password,
            is_password_same = await bcrypt.compare(user_password, extracted_password)

            console.log("password same?", is_password_same);
            
        return is_password_same;
    }
}

export {
    ExpressAuthService
}