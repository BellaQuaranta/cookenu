import { validateEmail } from './../uteis/ValidateEmail';
import { SignUp } from './../entities/SignUp';
import { TokenGenerator } from '../uteis/TokenGenerator';
import { Request, Response } from "express"
import { IdGenerator } from "../uteis/IdGenerator"
import { HashManager } from '../uteis/HashManagert';
import { User } from '../entities/User';

export const signUp = async (req: Request, res: Response) => {
    try {
        const id = new IdGenerator().generate()
        const { name, email, password, role } = req.body // nome, email, senha e tipo do usuário

        //VERIFICAÇÕES
        if (!name || !email || !password || !id || !role) {
            res.status(422)
            throw new Error("Parâmetros inválidos. Verifique se 'name', 'email', 'password', 'role' estão preenchidos corretamente.")
        }

        if (validateEmail(email) === false) {
            res.status(422)
            throw new Error("Email não está no formato certo: string@string.string")
        }

        //se a senha tiver menos de 6 caracteres, joga um erro
        if (password.length < 6) {
            res.status(422)
            throw new Error("'Password' inválido. Insira um password que tenha, no mínimo, 6 caracteres.")
        }

        //se o role for diferente de NORMAL ou ADMIN, joga um erro
        if (role !== "NORMAL" && role !== "ADMIN") {
            res.status(422)
            throw new Error("Parâmetro role aceita somente 'NORMAL' ou 'ADMIN'.")
        }

        //verifica se o email existe
        const user = await User.getUser("%", email)

        //se não existe joga um erro
        if (user.length) {
            res.status(409)
            throw new Error("Esse email já está sendo usado.")
        }

        //criptografa a senha
        const cipherPassword = HashManager.hash(password)

        //insere o usuário na tabela
        new SignUp(id, name, email, cipherPassword, role).createUser()

        //gera o token de acesso
        const token = TokenGenerator.generate({ id, name, email, role })

        //sucesso
        res.status(201).send({
            message: "Usuário criado com sucesso.",
            token
        })

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}