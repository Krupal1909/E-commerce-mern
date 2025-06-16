const express = require("express");
const connectDB = require("./utills/db");
const authRoutes = require("./routes/auth/auth.routes");
const category = require("./routes/category/category.routes");
const Product = require("./routes/product/product.routes");
const Cart = require("./routes/cart/cart.routes");
const Order = require("./routes/order/order.routes");
const userAddress = require("./routes/userAddress/userAddress.routes");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/category", category);
app.use("/api/product", Product);
app.use("/api/cart", Cart);
app.use("/api/order", Order);
app.use("/api/user-address", userAddress);
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
