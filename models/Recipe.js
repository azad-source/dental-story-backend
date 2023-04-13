const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientSchema = new Schema(
  {
    name: String,
    quantity: Number,
    quantityType: {
      type: String,
      enum: ["WEIGHT", "TEA_SPOON", "TABLE_SPOON", "VOLUME", "THINGS"],
      default: "WEIGHT",
    },
  },
);

const recipesSchema = new Schema(
  {
    /** Название блюда */
    name: {
      type: String,
    },
    /** Время приготовления в минутах */
    preparingTime: {
      type: Number,
    },
    /** Количество порций */
    servingsNumber: {
      type: Number,
    },
    /** Ингредиенты */
    ingredients: {
      type: [IngredientSchema],
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipesSchema);
module.exports = Recipe;
