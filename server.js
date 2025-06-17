const express = require("express");
const path = require("path");
const connectDB = require("./utills/db");
const authRoutes = require("./routes/auth/auth.routes");
const category = require("./routes/category/category.routes");
const Product = require("./routes/product/product.routes");
const Cart = require("./routes/cart/cart.routes");
const Order = require("./routes/order/order.routes");
const userAddress = require("./routes/userAddress/userAddress.routes");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", category);
app.use("/api/product", Product);
app.use("/api/cart", Cart);
app.use("/api/order", Order);
app.use("/api/user-address", userAddress);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });