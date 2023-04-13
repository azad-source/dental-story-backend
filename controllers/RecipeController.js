const Recipe = require("../models/Recipe");

/** Get list of recipes */
const getRecipes = (req, res, next) => {
  Recipe.find()
    .sort("-updatedAt")
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

/** Get recipe by ID  */
const getRecipeById = (req, res, next) => {
  let recipeID = req.body.recipeID;
  Recipe.findById(recipeID)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

/** Get random recipe */
const getRandomRecipe = (req, res, next) => {
  Recipe.countDocuments({}, (err, count) => {
    const random = Math.floor(Math.random() * count);
    Recipe.findOne()
      .skip(random)
      .exec(function (err, response) {
        res.json(response);
        if (err) {
          res.json(err);
        }
      });
  });
};

/** Add new recipe */
const addRecipe = (req, res, next) => {
  let recipe = new Recipe({
    name: req.body.name,
    preparingTime: req.body.preparingTime,
    servingsNumber: req.body.servingsNumber,
    ingredients: req.body.ingredients,
  });

  recipe
    .save()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

/** Update recipe by id */
const updateRecipe = (req, res, next) => {
  let recipeID = req.body.recipeID;

  let updateData = {
    name: req.body.name,
    preparingTime: req.body.preparingTime,
    servingsNumber: req.body.servingsNumber,
    ingredients: req.body.ingredients,
  };

  Recipe.findByIdAndUpdate(recipeID, { $set: updateData }, { new: true })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

/** Delete recipe by id */
const removeRecipe = (req, res, next) => {
  let recipeID = req.body.recipeID;

  Recipe.findByIdAndRemove(recipeID)
    .then(() => {
      res.json(true);
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
};

module.exports = {
  getRecipes,
  getRecipeById,
  getRandomRecipe,
  addRecipe,
  updateRecipe,
  removeRecipe,
};
