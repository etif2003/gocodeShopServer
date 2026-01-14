import { Product } from "../models/Product.js";
import fs from "fs";

export const getAllProductsService = () => {
  return Product.find({});
};

export const getProductByIdService = (id) => {
  return Product.findOne({ _id: id });
};

export const createProductService = (body) => {
  return new Product(body);
};

export const saveProductService = (newProduct) => {
  return newProduct.save();
};

export const deleteProductByIdService = (id) => {
  return Product.findByIdAndDelete(id);
};

export const updateProductByIdService = (id, updates) => {
  return Product.findByIdAndUpdate(id, updates, {
    new: true,
  });
};

export const readProductFromFileService = () => {
  return JSON.parse(fs.readFileSync("./products.json", { encoding: "utf-8" }));
};

export const deleteAllProductsService = () => Product.deleteMany({});

export const insertAllProductsService = (products) =>
  Product.insertMany(products);
