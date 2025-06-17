const jwt = require("jsonwebtoken");
const UserModel = require("../../models/user.model");

const logout = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

module.exports = logout;