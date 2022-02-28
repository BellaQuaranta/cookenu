import { ROLE_USER } from "./Role_User.enum";

export interface Users {
    id: string,
    name: string,
    email: string,
    password: string,
    role: ROLE_USER
}