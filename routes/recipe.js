const express = require("express");
const router = express.Router();

const RecipeController = require("../controllers/RecipeController");

router.get("/getAll", RecipeController.getRecipes);
router.post("/getById", RecipeController.getRecipeById);
router.get("/getRandomOne", RecipeController.getRandomRecipe);
router.post("/add", RecipeController.addRecipe);
router.post("/updateById", RecipeController.updateRecipe);
router.post("/removeById", RecipeController.removeRecipe);

module.exports = router;
