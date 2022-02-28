import { User } from './../entities/User';
import { Request, Response } from "express"
import { TokenGenerator } from "../uteis/TokenGenerator"

export const getOtherProfile = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization
        const id = req.params.id // id do usuário de busca

        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //checa se o token é válido
        TokenGenerator.verifyToken(token)

        //pega o perfil do usuário
        const user = await User.getUser(id, "%")

        //se não houver joga um erro
        if (!user.length) {
            res.status(404)
            throw new Error("Usuário não encontrado.")
        }

        //sucesso
        res.status(200).send({
            id: id,
            name: user[0].name,
            email: user[0].email
        })

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}
