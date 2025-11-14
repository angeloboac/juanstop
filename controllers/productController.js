const Product = require("../model/Product");
const uploadToImgBB = require("../utils/imgbbUpload");

// Register a new product
exports.register = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const img = req.file ? await uploadToImgBB(req.file) : ""; // Upload image to ImgBB

    const product = new Product({ name, price, img, stock, category });
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Edit a product by ID
exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category, currentImage } = req.body;
    const img = req.file ? await uploadToImgBB(req.file) : currentImage; // Update image if new file uploaded

    const updated = await Product.findByIdAndUpdate(
      id,
      { name, price, stock, category, img },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a product by ID
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all products with filter
exports.getAllProductsFilter = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if(category && category !== "All") filter.category = category;
    if(search) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter);
    res.json(products);
  } catch(err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};