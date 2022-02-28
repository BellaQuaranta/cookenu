import { Recipes } from './../entities/Recipe';
import { Request, Response } from "express"
import { TokenGenerator } from "../uteis/TokenGenerator"

export const feedRecipes = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization

        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //checa se o token é valido e retorna as informações
        const checkToken = TokenGenerator.verifyToken(token)

        //pega as receitas do feed
        const recipes = await Recipes.getRecipesByFeed(checkToken.id)

        //se não houver joga um erro
        if (!recipes.length) {
            res.status(404)
            throw new Error("Sem receitas no feed. Siga mais pessoas para preencher o seu feed.")
        }

        //muda a forma que a data vem
        recipes.forEach((recipe) => {
            recipe.createdAt = recipe.createdAt.toLocaleDateString()
        })

        //sucesso
        res.status(200).send({
            recipes: recipes
        })

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}
