import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect_db.js";
import "dotenv/config";

import {
  addProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  resetProductsController,
  updateProductController,
} from "./controllers/Product.js";
import {
  addAllUsersController,
  changeUserPasswordController,
  deleteAllUsersController,
  deleteUserByIdController,
  getAllUsersController,
  getUserByIdController,
  loginUsersController,
  registerUserController,
  resetUsersController,
  updateUserByIdController,
} from "./controllers/User.js";

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const app = express();

app.use(express.json());
app.use(cors());

// -------------------- ROUTES -------------------- //

// Product:

app.get("/products", getAllProductsController);

app.get("/products/id/:id", getProductByIdController);

app.post("/products", addProductController);

app.delete("/products/id/:id", deleteProductController);

app.put("/products/id/:id", updateProductController);

app.post("/products/reset", resetProductsController);

// User:

app.get("/users", getAllUsersController);

app.get("/users/:userId", getUserByIdController);

app.post("/users", registerUserController);

app.delete("/users/:userId", deleteUserByIdController);

app.delete("/users/allUsers", deleteAllUsersController);

app.put("/users/:userId", updateUserByIdController);

app.post("/users/allUsers", addAllUsersController);

app.post("/users/reset", resetUsersController);

app.post("/users/login", loginUsersController);

app.post("/users/:userId/changePassword", changeUserPasswordController);

// -------------------- START SERVER -------------------- //
const startServer = async () => {
  if (!mongoURI) {
    console.error("MONGO_URI is not defined!");
    process.exit(1);
  }
  await connectDB(mongoURI);
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
};

startServer();
