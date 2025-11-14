const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  username: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  userId: { type: String, required: true },
  productId: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);