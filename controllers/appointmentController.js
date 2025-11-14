const Appointment = require("../model/Appointment");

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("mechanic");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get appointments by  user ID)
exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({_id:req.params.id});
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getUserPersonalAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.id })
      .populate("mechanic", "name"); // only get the 'name' field from mechanic

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { name, contact, services, mechanic, date, time, notes, userId } = req.body;

    const newAppointment = await Appointment.create({
      name,
      contact,
      services,
      mechanic,
      date,
      time,
      notes,
      userId,
    });

    res.json({ success: true, appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json({ success: true, appointment: updatedAppointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
