const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
          max : 10
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;