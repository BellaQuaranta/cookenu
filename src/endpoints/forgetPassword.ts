import { sendMail } from './../data/transporter';
import { User } from './../entities/User';
import { TokenGenerator } from './../uteis/TokenGenerator';
import { Request, Response } from "express"
import { HashManager } from '../uteis/HashManagert';

export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const email = req.body.email
        const token = req.headers.authorization

        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //verifica se o email existe
        if (!email) {
            res.status(422)
            throw new Error("Parâmetros inválidos. Verifique se 'email' está preenchido corretamente.")
        }

        //Checa se o token é válido
        const checkToken = TokenGenerator.verifyToken(token)

        //verifica se o email existe
        const checkEmail = await User.getUser("%", email)

        //se não existe joga erro
        if (!checkEmail.length) {
            res.status(404)
            throw new Error("Usuário não foi encontrado.")
        }

        //criptografa a senha nova
        const cipherPassword = HashManager.hash("senhapadrao123")

        //envia pra editar na tabela
        User.updatePassword(cipherPassword, checkToken.id)

        //envia email
        await sendMail(checkToken.name, email)

        //sucesso
        res.status(200).send("Email de redefinição de senha enviado.")

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}