const userAddressSchema = require("../../models/userAddress");

const addUserAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
    } = req.body;
    const userId = req.user?._id;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newAddress = await userAddressSchema.create({
      userId,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
    });

    res.status(201).json({
      success: true,
      message: "User address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Error adding user address:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user?._id;
    const addresses = await userAddressSchema.find({ userId });

    if (addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No addresses found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
    } = req.body;
    const userId = req.user?._id;
    if (
      !id ||
      !firstName ||
      !lastName ||
      !email ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const updatedAddress = await userAddressSchema.findOneAndUpdate(
      { _id: id, userId },
      {
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        zipCode,
        country,
        phoneNumber,
      },
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or you do not have permission to update it",
      });
    }
    res.status(200).json({
      success: true,
      message: "User address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating user address:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required",
      });
    }

    const deletedAddress = await userAddressSchema.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or you do not have permission to delete it",
      });
    }

    res.status(200).json({
      success: true,
      message: "User address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user address:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress,
};