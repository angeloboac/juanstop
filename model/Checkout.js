const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending, Paid, Cancelled
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: null } // new field for payment date
});

module.exports = mongoose.model("Checkout", checkoutSchema);
