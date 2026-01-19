import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect_db.js";
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
  addUserController,
  changeUserPasswordController,
  deleteAllUsersController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  loginUsersController,
  resetUsersController,
  updateUserController,
} from "./controllers/User.js";

const port = 3000;
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

app.get("/users/:idNumber", getUserByIdController);

app.post("/users", addUserController);

app.post("/users/allUsers", addAllUsersController);

app.delete("/users/:idNumber", deleteUserController);

app.delete("/users/allUsers", deleteAllUsersController);

app.put("/users/:idNumber", updateUserController);

app.put("/users/reset", resetUsersController);

app.post("/users/login", loginUsersController);

app.put("/users/:idNumber/password", changeUserPasswordController);

// -------------------- START SERVER -------------------- //

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
};

startServer();
