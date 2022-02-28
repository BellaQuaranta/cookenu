import { ROLE_USER } from './../interfaces e enums/Role_User.enum';
import { User } from "./User";

export class SignUp extends User {
    constructor(
        protected id: string,
        protected name: string,
        email: string,
        password: string,
        protected role: ROLE_USER
    ) {
        super(email, password)
    }

    public async createUser(): Promise<void> {
        try {
            await SignUp.connection("cookenu_users")
                .insert({
                    id: this.id,
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    role: this.role
                })

        } catch (error: any) {
            throw new Error(error.sql || error.message)
        }
    }


}