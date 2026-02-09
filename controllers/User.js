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
    const savedUser = await registerUserService({ ...req.body });

    return serverResponse(res, 201, savedUser);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error creating user", error: error.message });
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

    const isLogged = await loginUserService(email, password);

    if (!isLogged) {
      return serverResponse(res, 401, "Invalid credentials");
    }

    //JWT
    const user = { email: email };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
    //---

    //return serverResponse(res, 200, { isLogged: isLogged });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error login user", error: error.message });
  }
};

let refreshTokens = [];

export const userTokenController = (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ email: user.email });
    res.status(200).json({ accessToken: accessToken });
  });
};

export const logoutUsersController = (req, res) => {
  try {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

    return serverResponse(res, 204, "Logged out successfully");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

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
      newPassword
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
