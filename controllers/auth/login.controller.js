const jwt = require("jsonwebtoken");
const UserModel = require("../../models/user.model");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingUser = await UserModel.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await existingUser.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    existingUser.password = undefined;

    // Send response
    res.status(200).json({
      success: true,
      message: "User login successfully",
      token,
      user: existingUser,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = login;
