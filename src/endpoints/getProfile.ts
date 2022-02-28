import { TokenGenerator } from './../uteis/TokenGenerator';
import { Request, Response } from "express"

export const getProfile = (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization

        //VERIFICAÇÕES
        if (!token) {
            res.status(401)
            throw new Error("Token de autorização ausente ou usuário não autorizado.")
        }

        //Checa se o token é válido e retorna as informações dele
        const checkToken = TokenGenerator.verifyToken(token)

        //sucesso
        res.status(200).send({
            id: checkToken.id,
            name: checkToken.name,
            email: checkToken.email
        })

    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message)
        }
    }
}
