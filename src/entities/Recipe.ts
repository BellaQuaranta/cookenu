import { BaseDataBase } from "../data/BaseDataBase"
import { RecipesType } from "../interfaces e enums/Recipes.interface"
export class Recipes extends BaseDataBase {
    protected createdAt: Date = new Date()

    constructor(protected id: string, protected title: string, protected description: string, protected id_user: string) {
        super()
    }

    public async createRecipe(): Promise<void> {
        try {
            await Recipes.connection("cookenu_recipes")
                .insert({
                    id: this.id,
                    title: this.title,
                    description: this.description,
                    createdAt: this.createdAt,
                    id_user: this.id_user
                })
        } catch (error: any) {
            throw new Error(error.sql || error.message)
        }
    }

    public static async getRecipes(id: string): Promise<RecipesType[]> {
        try {
            const recipes = await Recipes.connection("cookenu_recipes")
                .where({ id })

            return recipes

        } catch (error: any) {
            throw new Error(error.sql || error.message)
        }
    }

    public static async getRecipesByFeed(id_userFollowing: string): Promise<any[]> {

        try {
            const recipes = await Recipes.connection("cookenu_followers")
                .select("cookenu_recipes.id as id", "cookenu_recipes.title", "cookenu_recipes.description", "cookenu_recipes.createdAt", "cookenu_users.id as userId", "cookenu_users.name as userName")
                .join("cookenu_recipes", "cookenu_recipes.id_user", "cookenu_followers.id_userFollowed")
                .join("cookenu_users", "cookenu_users.id", "cookenu_recipes.id_user")
                .where({ id_userFollowing })
                .orderBy("cookenu_recipes.createdAt", "DESC")

            return recipes
        } catch (error: any) {
            throw new Error(error.sql || error.message)
        }

    }

    public static async updateRecipe(id: string, title: string, description: string): Promise<void> {
        try {
            await Recipes.connection("cookenu_recipes")
                .update({
                    title: title,
                    description: description
                })
                .where({ id })

        } catch (error: any) {
            throw new Error(error.sql || error.message)
        }
    }

    public static async deleteRecipe(id: string, id_user: string): Promise<any> {
        try {
            return await Recipes.connection("cookenu_recipes")
                .where({ id })
                .orWhere({ id_user })
                .delete()
        } catch (error: any) {
            throw new Error(error.sql || error.message)
        }
    }
}