import { Recipes } from './../entities/Recipe';
import { Request, Response } from "express"
import { TokenGenerator } from "../uteis/TokenGenerator"

export const getRecipe = async (req: Request, res: Response) => {
    try {
        const id = req.params.id // id da receita
        const token = req.headers.authorization // token de verificação 

        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //Checa se o token é válido
        TokenGenerator.verifyToken(token)

        //se o token for válido, o usuário está liberado para pegar a receita
        const recipe = await Recipes.getRecipes(id)

        //se a receita não existe, joga um erro
        if (!recipe.length) {
            res.status(404)
            throw new Error("Receita não encontrada.")
        }

        //muda o formato da data para exibir
        const createdAt = recipe[0].createdAt.toLocaleDateString()

        //sucesso
        res.status(200).send({
            id: recipe[0].id,
            title: recipe[0].title,
            description: recipe[0].description,
            createdAt: createdAt
        })

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}
