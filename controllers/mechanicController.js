const Mechanic = require("../model/Mechanic");
const uploadToImgBB = require("../utils/imgbbUpload");

// Get all mechanics
exports.getAllMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find();
    res.json(mechanics);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single mechanic
exports.getMechanicById = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) return res.status(404).json({ success: false, message: "Mechanic not found" });
    res.json(mechanic);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create mechanic
exports.createMechanic = async (req, res) => {
  try {
    const { name, position, skills } = req.body;
    const imageUrl = await uploadToImgBB(req.file); // use util

    const newMechanic = await Mechanic.create({
      name,
      position,
      skills: skills.split(","),
      imageUrl,
    });
    res.json({ success: true, mechanic: newMechanic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update mechanic
exports.updateMechanic = async (req, res) => {
  try {
    const { name, position, skills, currentImage } = req.body;
    const imageUrl = req.file ? await uploadToImgBB(req.file) : currentImage;

    const updatedMechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      { name, position, skills: skills.split(","), imageUrl },
      { new: true }
    );
    res.json({ success: true, mechanic: updatedMechanic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete mechanic
exports.deleteMechanic = async (req, res) => {
  try {
    await Mechanic.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Mechanic deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET schedule of a mechanic
exports.getSchedule = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) return res.status(404).json({ success: false, message: "Mechanic not found" });
    res.json({ schedule: mechanic.schedule || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE / ADD schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { date, time, deleteId } = req.body;
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) return res.status(404).json({ success: false, message: "Mechanic not found" });

    if (deleteId) {
      // Remove schedule with _id = deleteId
      mechanic.schedule = mechanic.schedule.filter(s => s._id.toString() !== deleteId);
    } else {
      // Add new schedule
      mechanic.schedule.push({ date, time });
    }

    await mechanic.save();
    res.json({ success: true, schedule: mechanic.schedule, name: mechanic.name });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};