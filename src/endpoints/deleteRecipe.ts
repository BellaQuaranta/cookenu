import { Request, Response } from "express"
import { Recipes } from "../entities/Recipe"
import { TokenGenerator } from "../uteis/TokenGenerator"

export const deleteRecipe = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const token = req.headers.authorization

        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //Checa se o token é válido
        const checkToken = TokenGenerator.verifyToken(token)

        //verifica se a receita existe
        const [checkRecipe] = await Recipes.getRecipes(id)

        //se não existir joga erro
        if (!checkRecipe) {
            res.status(404)
            throw new Error("Receita não encontrada.")
        }

        //se for um usuário normal e a receita não for dele joga erro
        if (checkRecipe.id_user !== checkToken.id && checkToken.role === 'NORMAL') {
            res.status(401)
            throw new Error("Esse usuário não tem permissão para alterar essa receita.")
        }

        await Recipes.deleteRecipe(id,"%")

        res.status(200).send("Receita deletada.")
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}

