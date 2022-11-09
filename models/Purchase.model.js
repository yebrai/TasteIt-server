const { Schema, model } = require("mongoose");

const purchaseSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    price: Number,
    shippingCost: Number,
  },
  {
    timestamps: true,
  }
);

const Purchase = model("Purchase", purchaseSchema);

module.exports = Purchase;
