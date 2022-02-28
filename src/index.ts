import { forgetPassword } from './endpoints/forgetPassword';
import { feedRecipes } from './endpoints/feedRecipes';
import { unfollowUser } from './endpoints/unfollowUser';
import { followUser } from './endpoints/followUser';
import { getRecipe } from './endpoints/getRecipe';
import { createRecipe } from './endpoints/createRecipe';
import { getOtherProfile } from './endpoints/getOtherProfile';
import { getProfile } from './endpoints/getProfile';
import { login } from './endpoints/login';
import { app } from './app';
import { signUp } from './endpoints/signUp';
import { editRecipe } from './endpoints/editRecipe';
import { deleteRecipe } from './endpoints/deleteRecipe';
import { deleteUser } from './endpoints/deleteUser';

//USERS
app.post("/signup", signUp)
app.post("/login", login)
app.get("/user/profile", getProfile)
app.get("/user/feed", feedRecipes)
app.get("/user/:id", getOtherProfile)
app.post("/user/follow", followUser)
app.delete("/user/unfollow", unfollowUser)
app.delete("/user/:id", deleteUser)
app.put("/user/password", forgetPassword)

//RECIPES
app.post("/recipe", createRecipe)
app.get("/recipe/:id", getRecipe)
app.put("/recipe/:id", editRecipe)
app.delete("/recipe/:id", deleteRecipe)