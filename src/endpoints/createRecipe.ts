import { Recipes } from './../entities/Recipe';
import { Request, Response } from "express"
import { IdGenerator } from "../uteis/IdGenerator"
import { TokenGenerator } from '../uteis/TokenGenerator';

export const createRecipe = (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization // token de verificação
        const { title, description } = req.body // titulo e descrição da receita
        const id = new IdGenerator().generate()

        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //se não tiver titulo ou não tiver descrição ele joga erro
        if (!title || !description) {
            res.status(422)
            throw new Error("Parâmetros inválidos. Verifique se 'title', 'description' estão preenchidos corretamente.")
        }

        //checa se o token é valido e retorna as informações
        const checkToken = TokenGenerator.verifyToken(token)

        //cria nova receita
        new Recipes(id, title, description, checkToken.id).createRecipe()

        //sucesso
        res.status(201).send("Receita criada com sucesso.")

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}
