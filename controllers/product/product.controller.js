const Product = require("../../models/product.model");

const GetAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId");
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log("Product Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const GetProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    const product = await Product.findById(id).populate("categoryId");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log("Product Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const CreateProduct = async (req, res) => {
  try {
    const { name, description, image, rating, price, discountedPrice, categoryId } = req.body;
    if (!name || !description || !image || !rating || !price || !discountedPrice || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const newProduct = await Product.create({
      name,
      description,
      image,
      rating,
      price,
      discountedPrice,
      categoryId
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log("Product Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("Product Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Product Deletion Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAllRelatedProducts = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }
    const relatedProducts = await Product.find({ categoryId }).populate("categoryId");
    if (relatedProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No related products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Related products fetched successfully",
      products: relatedProducts,
    });
  }
  catch (error) {
    console.log("Related Products Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  } 
}

module.exports = {
  GetAllProducts,
  GetProductById,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  getAllRelatedProducts
};