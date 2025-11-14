const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  contact: { type: String, required: true },
  services: [{ type: String, required: true }],
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: "Mechanic", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  notes: { type: String },
  status: { type: String, default: "Pending" }, // pending, confirmed, completed
}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);
