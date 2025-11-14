const Cart = require("../model/Cart");
const Product = require("../model/Product");

// Add to cart
// Add to cart
exports.addToCart = async (req, res) => {

  const { username, userId, productId, quantity } = req.body;

  if (!username || !userId || !productId || !quantity) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    // Reduce product stock
    product.stock -= quantity;
    await product.save();

    // Check if the user already has this product in the cart
    let cartItem = await Cart.findOne({ username, productId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({ username, userId, productId, quantity });
      await cartItem.save();
    }

    res.json({ success: true, message: `${product.name} added to cart!`, cartItem });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
};

// Get all cart items for a user (simple, no populate)
// Assuming your Cart model has productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }

exports.getCartByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Get all cart items for the user
    const cartItems = await Cart.find({ userId });

    // Fetch the corresponding product for each cart item
    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          _id: item._id,
          username: item.username,
          quantity: item.quantity,
          userId: item.userId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          product: product || null // include full product info
        };
      })
    );

    res.json(cartWithProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch cart items" });
  }
};


// Update cart item by ID
// Update cart item by ID
// Update cart item by ID
exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    // Populate the productId field and return it as 'product'
    const cartItem = await Cart.findById(id).populate("productId");
    if (!cartItem) 
      return res.status(404).json({ success: false, message: "Cart item not found" });

    cartItem.quantity = quantity;
    await cartItem.save();

    // Convert to object and rename 'productId' to 'product'
    const itemObj = cartItem.toObject();
    itemObj.product = itemObj.productId;
    delete itemObj.productId;

    res.json({ success: true, message: "Cart item updated", cartItem: itemObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update cart item" });
  }
};


// Delete cart item by ID
exports.deleteCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Cart.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ success: false, message: "Cart item not found" });

    res.json({ success: true, message: "Cart item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete cart item" });
  }
};