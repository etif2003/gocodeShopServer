import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect_db.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

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
  logoutUsersController,
} from "./controllers/User.js";
import { authenticateToken } from "./middleware/authenticateToken.js";

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const app = express();

app.use(express.json());
app.use(cors());

// -------------------- ROUTES -------------------- //

// Product:

app.get("/api/products", getAllProductsController);

app.get("/api/products/id/:id", getProductByIdController);

app.post("/api/products", addProductController);

app.delete("/api/products/id/:id", deleteProductController);

app.put("/api/products/id/:id", updateProductController);

app.post("/api/products/reset", resetProductsController);

// User:

app.get("/api/users", getAllUsersController);

app.get("/api/users/user/:userId", getUserByIdController);

app.delete("/api/users/user/:userId", deleteUserByIdController);

app.delete("/api/users/allUsers", deleteAllUsersController);

app.put("/api/users/user/:userId", updateUserByIdController);

app.post("/api/users/allUsers", addAllUsersController);

app.post("/api/users/reset", resetUsersController);

app.post("/api/users", registerUserController);

app.post("/api/users/login", loginUsersController);

app.delete("/api/users/logout", logoutUsersController);

app.post(
  "/api/users/user/:userId/changePassword",
  authenticateToken,
  changeUserPasswordController,
);

// -------------------- START SERVER -------------------- //
const startServer = async () => {
  if (!mongoURI) {
    console.error("MONGO_URI is not defined!");
    process.exit(1);
  }
  await connectDB(mongoURI);
  app.listen(port, () => {
    console.log(`🚀 Server running at port:${port}`);
  });
};

startServer();
