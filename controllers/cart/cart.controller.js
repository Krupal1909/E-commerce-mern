const cartSchema = require("../../models/cart.model");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?. _id; 
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }
    // Check if the product already exists in the cart
    const existingCartItem = await cartSchema.findOne({
      userId,
      productId,
    });
    if (existingCartItem) {
      // If it exists, update the quantity
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({
        success: true,
        message: "Product quantity updated in cart",
        cartItem: existingCartItem,
      });
    } else {
      // If it doesn't exist, create a new cart item
      const newCartItem = await cartSchema.create({
        userId,
        productId,
        quantity,
      });
      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        cartItem: newCartItem,
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getCartItems = async (req, res) => {
  try {
    const userId = req.user?. _id; 
    const cartItems = await cartSchema.find({ userId }).populate("products.productId");
    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No items found in cart",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      cartItems,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Cart item ID and quantity are required",
      });
    }
    const updatedCartItem = await cartSchema.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );
    if (!updatedCartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cart item ID is required",
      });
    }
    const deletedCartItem = await cartSchema.findByIdAndDelete(id);
    if (!deletedCartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem
};