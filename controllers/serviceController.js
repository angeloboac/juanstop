const Service = require("../model/Service");
const uploadToImgBB = require("../utils/imgbbUpload"); // optional image upload

// GET all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE service
exports.createService = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = "";
    if (req.file) imageUrl = await uploadToImgBB(req.file);

    const newService = await Service.create({ name, imageUrl });
    res.json({ success: true, service: newService });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE service
exports.updateService = async (req, res) => {
  try {
    const { name } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    service.name = name || service.name;
    if (req.file) service.imageUrl = await uploadToImgBB(req.file);
    await service.save();

    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE service
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
