import {
  changeUserPasswordService,
  createUserService,
  deleteAllUsersService,
  deleteUserByIdService,
  getAllUsersService,
  getUserByIdService,
  insertAllUsersService,
  loginUserService,
  readUsersFromFileService,
  saveUserService,
  updateUserByIdService,
} from "../services/User.js";
import { serverResponse } from "../utils/server-response.js";

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
    const user = await getUserByIdService(req.params.idNumber);

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

export const addUserController = async (req, res) => {
  try {
    const newUser = createUserService(req.body);
    const savedUser = await saveUserService(newUser);
    return serverResponse(res, 201, savedUser);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const userToDelete = await deleteUserByIdService(req.params.idNumber);

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

export const updateUserController = async (req, res) => {
  try {
    const userById = await getUserByIdService(req.params.idNumber);

    if (!userById) {
      return serverResponse(res, 404, "User not found");
    }

    const updates = { ...req.body };
    const invalidFields = Object.keys(updates).filter(
      (key) => !(key in userById)
    );

    if (invalidFields.length > 0) {
      return serverResponse(
        res,
        400,
        `Invalid fields to update: ${invalidFields}`
      );
    }

    const userToUpdate = await updateUserByIdService(
      req.params.idNumber,
      updates
    );

    return serverResponse(res, 200, userToUpdate);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
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

export const loginUsersController = async (req, res) => {
  try {
    const { idNumber, password } = req.body;

    if (!idNumber || !password) {
      return serverResponse(res, 400, "Missing idNumber or password");
    }

    const user = await loginUserService(idNumber, password);

    if (!user) {
      return serverResponse(res, 401, "Invalid credentials");
    }

    return serverResponse(res, 200, user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error login user", error: error.message });
  }
};

export const changeUserPasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { idNumber } = req.params;

    if (!oldPassword || !newPassword) {
      return serverResponse(res, 400, "Missing passwords");
    }

    const updatedUser = await changeUserPasswordService(
      idNumber,
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
