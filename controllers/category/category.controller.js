const CategoryModel = require("../../models/category.model");

const getAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const createCategory = async (req, res) => {
  try {
    const { name, description, rating, price, discountedPrice } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Create full URL for the image
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const image = `${baseUrl}/uploads/${req.file.filename}`;

    if (!name || !description || !rating || !price || !discountedPrice) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await CategoryModel.create({
      name,
      description,
      image,
      rating: Number(rating),
      price: Number(price),
      discountedPrice: Number(discountedPrice),
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Category Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Category Deletion Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, rating, price, discountedPrice } =
      req.body;
    if (
      !id ||
      !name ||
      !description ||
      !image ||
      !rating ||
      !price ||
      !discountedPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        image,
        rating,
        price,
        discountedPrice,
      },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Category Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById
};
