import { Product } from "../models/Product.js";
import fs from "fs";

// ---------- GET ----------

export const getAllProductsService = async () => {
  return await Product.find({});
};

export const getProductByIdService = async (id) => {
  return await Product.findOne({ _id: id });
};

// ---------- CREATE ----------

export const createProductService = (body) => {
  return new Product(body);
};

export const saveProductService = async (newProduct) => {
  return await newProduct.save();
};

export const insertAllProductsService = async (products) => {
  return await Product.insertMany(products);
};

// ---------- DELETE ----------

export const deleteProductByIdService = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const deleteAllProductsService = async () => {
  return await Product.deleteMany({});
};

// ---------- UPDATE ----------

export const updateProductByIdService = async (id, updates) => {
  return await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
};

// ---------- FILE ----------

export const readProductFromFileService = async () => {
  return await JSON.parse(
    fs.readFileSync("./products.json", { encoding: "utf-8" }),
  );
};
