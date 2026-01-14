import {
  createProductService,
  deleteAllProductsService,
  deleteProductByIdService,
  getAllProductsService,
  getProductByIdService,
  insertAllProductsService,
  readProductFromFileService,
  saveProductService,
  updateProductByIdService,
} from "../services/Product.js";
import { serverResponse } from "../utils/server-response.js";

export const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProductsService();
    return serverResponse(res, 200, products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error finding products", error: error.message });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    if (!product) {
      return serverResponse(res, 404, "Product not found");
    }

    return serverResponse(res, 200, product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error finding product", error: error.message });
  }
};

export const addProductController = async (req, res) => {
  try {
    const newProduct = createProductService(req.body);
    const savedProduct = await saveProductService(newProduct);
    return serverResponse(res, 201, savedProduct);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const productToDelete = await deleteProductByIdService(req.params.id);

    if (!productToDelete) {
      return serverResponse(res, 404, "Product not found");
    }

    return serverResponse(res, 200, productToDelete);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const productById = await getProductByIdService(req.params.id);

    if (!productById) {
      return serverResponse(res, 404, "Product not found");
    }

    const updates = { ...req.body };
    const invalidFields = Object.keys(updates).filter(
      (key) => !(key in productById)
    );

    if (invalidFields.length > 0) {
      return serverResponse(
        res,
        400,
        `Invalid fields to update: ${invalidFields}`
      );
    }

    const productToUpdate = await updateProductByIdService(
      req.params.id,
      updates
    );

    return serverResponse(res, 200, productToUpdate);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

export const resetProductsController = async (req, res) => {
  try {
    const products = readProductFromFileService();
    await deleteAllProductsService();
    await insertAllProductsService(products);
    return serverResponse(res, 201, products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resetting products", error: error.message });
  }
};
