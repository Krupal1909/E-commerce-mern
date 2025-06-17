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
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
require("dotenv").config();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
app.use('/api/payment', router);
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

router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount, 
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, 
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});
router.post('/verify', (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Create signature for verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified successfully
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message,
    });
  }
});

router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message,
    });
  }
});

// Handle payment webhook (optional - for production)
router.post('/webhook', (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookBody = JSON.stringify(req.body);
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(webhookBody)
      .digest('hex');

    if (webhookSignature === expectedSignature) {
      // Webhook is authentic
      const event = req.body.event;
      const paymentEntity = req.body.payload.payment.entity;
      
      console.log('Webhook received:', event);
      
      // Handle different webhook events
      switch (event) {
        case 'payment.captured':
          console.log('Payment captured:', paymentEntity.id);
          // Update order status in database
          break;
        case 'payment.failed':
          console.log('Payment failed:', paymentEntity.id);
          // Handle failed payment
          break;
        default:
          console.log('Unhandled webhook event:', event);
      }
      
      res.json({ status: 'ok' });
    } else {
      res.status(400).json({ error: 'Invalid webhook signature' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
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