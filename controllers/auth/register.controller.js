const express = require("express");
const UserModel = require("../../models/user.model");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const UserCreate = await UserModel.create({
      name,
      email,
      password,
    });
    if (UserCreate) {
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to register user",
      });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = registerUser;