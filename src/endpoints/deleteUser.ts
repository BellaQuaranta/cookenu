import { User } from './../entities/User';
import { Request, Response } from "express"
import { TokenGenerator } from "../uteis/TokenGenerator"
import { Recipes } from '../entities/Recipe';

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization
        const id = req.params.id

        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //Checa se o token é válido
        const checkToken = TokenGenerator.verifyToken(token)

        //Se for válido e o usuário não é um ADMIN joga erro
        if (checkToken.role !== "ADMIN") {
            res.status(401)
            throw new Error("Esse usuário não tem permissão para deletar outro usuário.")
        }

        //Deleta da tabela de seguidores, de receitas e de usuários
        User.unfollowUser(id, id, "y")
            .then(() => Recipes.deleteRecipe
                ("%", id))
            .then(() => User.deleteUser(id))

        res.status(200).send("Usuário deletado com sucesso.")

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}

