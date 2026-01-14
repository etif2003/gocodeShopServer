import express from "express";
import cors from "cors";
import { connectDB } from "./db/Product.js";
import {
  addProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  resetProductsController,
  updateProductController,
} from "./controllers/Product.js";

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

// const connectDB = async () => {
//   try {
//     const mongoURI = "mongodb://127.0.0.1:27017/gocode-shop";
//     await mongoose.connect(mongoURI);
//     console.log("✅ MongoDB Connected: gocode-shop");
//   } catch (err) {
//     console.error("❌ MongoDB Connection Error:", err.message);
//     process.exit(1);
//   }
// };

// const productSchema = new mongoose.Schema({
//   title: { type: String, required: true, min: 5, max: 800 },
//   price: { type: Number, required: true, min: 0 },
//   description: String,
//   category: String,
//   image: String,
//   rating: {
//     rate: { type: Number, min: 0, max: 10 },
//     count: Number,
//   },
// });

// const Product = mongoose.model("Product", productSchema);

// -------------------- ROUTES -------------------- //

app.get("/products", getAllProductsController);

app.get("/products/id/:id", getProductByIdController);

app.post("/products", addProductController);

app.delete("/products/id/:id", deleteProductController);

app.put("/products/id/:id", updateProductController);

app.post("/products/reset", resetProductsController);

// -------------------- START SERVER -------------------- //

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
};

startServer();

