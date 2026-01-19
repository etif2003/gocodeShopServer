import { User } from "../models/User.js";
import fs from "fs";

export const getAllUsersService = () => {
  return User.find({});
};

export const getUserByIdService = (id) => {
  return User.findOne({ idNumber: id });
};

export const createUserService = (body) => {
  return new User(body);
};

export const saveUserService = (newUser) => {
  return newUser.save();
};

export const deleteUserByIdService = (idNumber) => {
  return User.findOneAndDelete({ idNumber });
};

export const updateUserByIdService = (idNumber, updates) => {
  return User.findOneAndUpdate({ idNumber }, updates, { new: true });
};

export const readUsersFromFileService = () => {
  return JSON.parse(fs.readFileSync("./users.json", { encoding: "utf-8" }));
};

export const deleteAllUsersService = () => User.deleteMany({});

export const insertAllUsersService = (users) => User.insertMany(users);

export const loginUserService = async (idNumber, password) => {
  const user = await User.findOne({ idNumber });

  if (!user) return null;

  if (user.password !== password) return null;

  return user;
};

export const changeUserPasswordService = async (
  idNumber,
  oldPassword,
  newPassword
) => {
  const user = await User.findOne({ idNumber });

  if (!user) return null;

  if (user.password !== oldPassword) return null;

  user.password = newPassword;
  await user.save();

  return user;
};
