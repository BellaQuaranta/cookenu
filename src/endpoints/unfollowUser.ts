import { Request, Response } from "express"
import { User } from "../entities/User"
import { TokenGenerator } from "../uteis/TokenGenerator"

export const unfollowUser = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization
        const userToUnfollowId = req.body.userToUnfollowId //id do usuario que vai deixar de ser seguido

        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        // verifica se os parametro foram enviados
        if (!userToUnfollowId) {
            res.status(422)
            throw new Error("Parâmetros inválidos. Verifique se 'userToUnfollowId' está preenchido corretamente.")
        }

        //se foi, verifica se o token é válido
        const checkToken = TokenGenerator.verifyToken(token)

        //se for, verifica se o usuário do id existe
        const checkUser = await User.getUser(userToUnfollowId, "%")

        //se não existir, joga erro
        if (!checkUser.length) {
            res.status(404)
            throw new Error("Usuário não encontrado. Verifique o 'userToUnfollowId' passado.")
        }

        //se existir ele deleta da tabela de seguidores
        User.unfollowUser(checkToken.id, userToUnfollowId)

        //sucesso
        res.status(200).send("Deixou de ser seguir com sucesso")

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}