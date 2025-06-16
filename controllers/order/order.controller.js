const OrderModel = require('../../models/order.model');

const CreateOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, location } = req.body;

    if (!userId || !products || !totalAmount || !location) {
      return res.status(400).json({
        success: false,
        message: "User ID, products, total amount, and location are required",
      });
    }

    const newOrder = await OrderModel.create({
      userId,
      products,
      totalAmount,
      location,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const GetAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate("userId").populate("products.productId");
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const GetOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }
    const order = await OrderModel.findById(id).populate("userId").populate("products.productId");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const UpdateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const DeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }
    const deletedOrder = await OrderModel.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  CreateOrder,
  GetAllOrders,
  GetOrderById,
  UpdateOrder,
  DeleteOrder,
};