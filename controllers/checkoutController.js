const Checkout = require("../model/Checkout");
const User = require("../model/User"); 
// CREATE CHECKOUT
exports.createCheckout = async (req, res) => {
  try {
    const { userId, username, items, paymentMethod } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const totalAmount = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);

    const checkout = new Checkout({ userId, username, items, paymentMethod, totalAmount });
    await checkout.save();
    res.status(201).json(checkout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create checkout" });
  }
};


// GET ALL CHECKOUTS (excluding Paid orders)
exports.getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.find({ status: { $ne: "Paid" } }).sort({ createdAt: -1 });
    res.json(checkouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch checkouts" });
  }
};


// GET CHECKOUT BY ID
exports.getCheckoutById = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });
    res.json(checkout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch checkout" });
  }
};

// UPDATE CHECKOUT
exports.updateCheckout = async (req, res) => {
  try {
    const { status, paymentMethod } = req.body;

    const updateData = { status };
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

    // If status is Paid, set paidAt to current date
    if (status === "Paid") {
      updateData.paidAt = new Date();
    }

    const checkout = await Checkout.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    res.json(checkout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update checkout" });
  }
};

// DELETE CHECKOUT
exports.deleteCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.findByIdAndDelete(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });
    res.json({ message: "Checkout deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete checkout" });
  }
};


// Get Paid checkouts with pagination (Sales) with user info and optional date filter

exports.getSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const { date } = req.query; // optional YYYY-MM-DD

    // Filter: only Paid status
    const filter = { status: "Paid" };

    if (date) {
      // Parse YYYY-MM-DD as UTC start and end of the day
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T23:59:59.999Z`);
      filter.paidAt = { $gte: start, $lte: end };
    }

    const totalSales = await Checkout.countDocuments(filter);

    const sales = await Checkout.find(filter)
      .sort({ paidAt: -1 })
      .skip(skip)
      .limit(limit);

    // Flatten items and include user info
    const flattenedSales = await Promise.all(
      sales.flatMap(order =>
        order.items.map(async item => {
          const user = await User.findById(order.userId);
          return {
            userId: order.userId,
            username: user?.username || order.username,
            contact: user?.contact || "-",
            product: item.name,
            quantity: item.quantity,
            total: item.price * item.quantity,
            date: order.paidAt
          };
        })
      )
    );
    
    res.json({
      page,
      totalPages: Math.ceil(totalSales / limit),
      totalItems: totalSales,
      sales: flattenedSales
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};