import { TokenGenerator } from './../uteis/TokenGenerator';
import { User } from './../entities/User';
import { Request, Response } from "express"
import { HashManager } from "../uteis/HashManagert"

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        //VERIFICAÇÕES
        if (!email || !password) {
            res.status(422)
            throw new Error("Parâmetros inválidos. Verifique se 'email', 'password' estão preenchidos corretamente.")
        }

        //verifica se o email existe
        const user = await User.getUser("%", email)

        //se não existe joga um erro
        if (!user.length) {
            res.status(422)
            throw new Error("Email ou senha incorreta.")
        }

        //se existe, checa se a senha é compatível
        const checkPassword = await HashManager.compare(password, user[0].password)

        //se não for, joga erro
        if (checkPassword === false) {
            res.status(422)
            throw new Error("Email ou senha incorreta.")
        }

        //se for, gera um token de acesso
        const token = TokenGenerator.generate({
            id: user[0].id,
            name: user[0].name,
            email: email,
            role: user[0].role
        })

        //sucesso
        res.status(200).send({
            message: "Usuário logado.",
            token
        })

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}