import { Recipes } from './../entities/Recipe';
import { Request, Response } from "express"
import { TokenGenerator } from "../uteis/TokenGenerator"

export const editRecipe = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization
        const id = req.params.id
        const { title, description } = req.body

        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //verifica se o id existe e s
        if (!title && !description) {
            res.status(422)
            throw new Error("Parâmetros inválidos. Verifique se 'title', 'description' estão preenchidos corretamente.")
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

        //se ele for admin joga erro
        if (checkToken.role === "ADMIN") {
            res.status(403)
            throw new Error("'ADMIN' não pode editar a receita de um usuário.")
        }

        //se existir, verifica se pertence à aquele usuário
        if (checkToken.id !== checkRecipe.id_user) {
            res.status(403)
            throw new Error("Essa receita não pode ser alterada por você.")
        }

        // mudar na tabela
        Recipes.updateRecipe(id, title, description)

        //sucesso
        res.status(200).send("Receita editada com sucesso.")


    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}