import jwt from "jsonwebtoken";

import {
  changeUserPasswordService,
  deleteAllUsersService,
  deleteUserByIdService,
  getAllUsersService,
  getUserByIdService,
  insertAllUsersService,
  loginUserService,
  readUsersFromFileService,
  registerUserService,
  updateUserByIdService,
} from "../services/User.js";
import { serverResponse } from "../utils/server-response.js";

// ---------- GET ----------

export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return serverResponse(res, 200, users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error finding users", error: error.message });
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.userId);

    if (!user) {
      return serverResponse(res, 404, "User not found");
    }

    return serverResponse(res, 200, user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error finding user", error: error.message });
  }
};

// ---------- CREATE ----------

export const registerUserController = async (req, res) => {
  try {
    const result = await registerUserService({ ...req.body });

    if (!result) {
      return res
        .status(400)
        .json({ message: "Error creating user", error: error.message });
    }

    res.status(201).json({
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error registering user", error: error.message });
  }
};

// ---------- DELETE ----------

export const deleteUserByIdController = async (req, res) => {
  try {
    const userToDelete = await deleteUserByIdService(req.params.userId);

    if (!userToDelete) {
      return serverResponse(res, 404, "User not found");
    }

    return serverResponse(res, 200, userToDelete);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

export const deleteAllUsersController = async (req, res) => {
  try {
    await deleteAllUsersService();
    return serverResponse(res, 201);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting all users", error: error.message });
  }
};

// ---------- UPDATE ----------

export const updateUserByIdController = async (req, res) => {
  try {
    const updatedUser = await updateUserByIdService(req.params.userId, {
      ...req.body,
    });

    return serverResponse(res, 200, updatedUser);
  } catch (error) {
    if (error.message === "no user found") {
      return serverResponse(res, 404, "User not found");
    }

    if (error.message.startsWith("Invalid fields")) {
      return serverResponse(res, 400, error.message);
    }

    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// ---------- FILE ----------

export const addAllUsersController = async (req, res) => {
  try {
    const users = readUsersFromFileService();
    await insertAllUsersService(users);
    return serverResponse(res, 201, users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding all users", error: error.message });
  }
};

export const resetUsersController = async (req, res) => {
  try {
    const users = readUsersFromFileService();
    await deleteAllUsersService();
    await insertAllUsersService(users);
    return serverResponse(res, 201, users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resetting users", error: error.message });
  }
};

// ---------- AUTH ----------

export const loginUsersController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return serverResponse(res, 400, "Missing email or password");
    }

    const result = await loginUserService(email, password);

    if (!result) {
      return serverResponse(res, 401, "Invalid credentials");
    }

    res.json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error login user", error: error.message });
  }
};

export const logoutUsersController = (req, res) => {
  try {
    return serverResponse(res, 204, "Logged out successfully");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

export const changeUserPasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.params;

    if (!oldPassword || !newPassword) {
      return serverResponse(res, 400, "Missing passwords");
    }

    const updatedUser = await changeUserPasswordService(
      userId,
      oldPassword,
      newPassword,
    );

    if (!updatedUser) {
      return serverResponse(res, 401, "Old password is incorrect");
    }

    return serverResponse(res, 200, updatedUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error change user's password", error: error.message });
  }
};
