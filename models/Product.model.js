const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true,
      default: "https://nuwaay.com/wp-content/uploads/2022/01/default_256.png"
    },
    category: {
      type: String,
      enum: ["foods", "desserts", "drinks"],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    whoRates: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    ratings: [Number]
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
