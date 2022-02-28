import { IdGenerator } from './../uteis/IdGenerator';
import { Request, Response } from "express"
import { User } from "../entities/User"
import { TokenGenerator } from "../uteis/TokenGenerator"

export const followUser = async (req: Request, res: Response) => {
    try {
        const id = new IdGenerator().generate()
        const token = req.headers.authorization
        const userToFollowId = req.body.userToFollowId //id do usuario que vai ser seguido
        
        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //verifica se foi enviado o id
        if (!userToFollowId) {
            res.status(422)
            throw new Error("Parâmetros inválidos. Verifique se 'userToFollowId' está preenchido corretamente.")
        }

        //verifica se o token é valido
        const checkToken = TokenGenerator.verifyToken(token)

        //verifica se o usuário existe
        const checkUser = await User.getUser(userToFollowId, "%")

        //se não existir joga erro
        if (!checkUser.length) {
            res.status(404)
            throw new Error("Usuário não encontrado. Verifique o 'userToFollowId' passado.")
        }

        //insere na tabela de seguidores
        User.followUser(id, checkToken.id, userToFollowId)

        //sucesso
        res.status(200).send("Seguido com sucesso.")

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}
