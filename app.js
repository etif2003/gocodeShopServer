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
  userTokenController,
  logoutUsersController
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
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/users", authenticateToken, getAllUsersController);

app.get("/users/user/:userId", getUserByIdController);

app.post("/users", registerUserController);

app.delete("/users/user/:userId", deleteUserByIdController);

app.delete("/users/allUsers", deleteAllUsersController);

app.put("/users/user/:userId", updateUserByIdController);

app.post("/users/allUsers", addAllUsersController);

app.post("/users/reset", resetUsersController);

app.post("/users/login", loginUsersController);

app.post("/users/token", userTokenController);

app.delete("/users/logout", logoutUsersController);

app.post("/users/user/:userId/changePassword", changeUserPasswordController);

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
