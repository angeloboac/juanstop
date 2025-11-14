const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  skills: { type: [String], required: true },
  imageUrl: { type: String },
  schedule: [
    {
      date: { type: Date, required: true },
      time: { type: String, required: true }, // you can also use Date if you prefer
      status: { type: String, enum: ["pending", "completed"], default: "pending" } // optional status
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Mechanic", mechanicSchema);
