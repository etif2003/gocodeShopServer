import { Product } from "../models/Product.js";
import fs from "fs";

export const getAllProductsService = async () => {
  return await Product.find({});
};

export const getProductByIdService = async (id) => {
  return await Product.findOne({ _id: id });
};

export const createProductService = (body) => {
  return new Product(body);
};

export const saveProductService = async (newProduct) => {
  return await newProduct.save();
};

export const deleteProductByIdService = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const updateProductByIdService = async (id, updates) => {
  return await Product.findByIdAndUpdate(id, updates, {
    new: true,
  });
};

export const readProductFromFileService = async () => {
  return await JSON.parse(
    fs.readFileSync("./products.json", { encoding: "utf-8" })
  );
};

export const deleteAllProductsService = async () => {
  return await Product.deleteMany({});
};

export const insertAllProductsService = async (products) => {
  return await Product.insertMany(products);
};
