import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import fs from "fs";

const hashFunc = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

// ---------- GET ----------

export const getAllUsersService = async () => {
  return await User.find({});
};

export const getUserByIdService = async (id) => {
  return await User.findOne({ _id: id });
};

// ---------- CREATE ----------

export const registerUserService = async (newUser) => {
  const hashedPassword = hashFunc(newUser.password);
  const userAfterHashing = { ...newUser, password: hashedPassword };
  const user = new User(userAfterHashing);
  return await user.save();
};

// ---------- DELETE ----------

export const deleteUserByIdService = async (id) => {
  return await User.findOneAndDelete({ _id: id });
};

export const deleteAllUsersService = async () => {
  return await User.deleteMany({});
};

// ---------- UPDATE ----------

export const updateUserByIdService = async (id, updates) => {
  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new Error("no user found");
  }

  const schemaPaths = Object.keys(User.schema.paths);

  const invalidFields = Object.keys(updates).filter(
    (key) => !schemaPaths.includes(key)
  );

  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields to update: ${invalidFields}`);
  }

  if ("password" in updates) {
    throw new Error("Password cannot be updated through this route");
  }

  const updatedUser = await User.findOneAndUpdate({ _id: id }, updates, {
    new: true,
  });
  return updatedUser;
};

// ---------- FILE ----------

export const readUsersFromFileService = async () => {
  const users = JSON.parse(
    fs.readFileSync("./users.json", { encoding: "utf-8" })
  );
  return users;
};

export const insertAllUsersService = async (users) => {
  const insertedUsers = await User.insertMany(users);
  return insertedUsers;
};

// ---------- AUTH ----------

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("no user found");
  }

  const isMatching = bcrypt.compareSync(password, user.password);
  return isMatching;
};

export const changeUserPasswordService = async (
  id,
  oldPassword,
  newPassword
) => {
  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new Error("no user found");
  }

  const isPasswordsMatching = bcrypt.compareSync(oldPassword, user.password);
  if (!isPasswordsMatching) {
    throw new Error("password do not match - good bye mr. hacker");
  }

  /* check that the new password is standing by the corrected regexes and patterns needed*/

  const hashedPassword = hashFunc(newPassword);

  return await User.findOneAndUpdate(
    { _id: id },
    { password: hashedPassword },
    { new: true }
  );
};
