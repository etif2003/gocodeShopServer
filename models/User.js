import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  idNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{9}$/, "ID must be exactly 9 digits"],
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  username: {
    type: String,
    required: true,
    minlength: 2,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  address: {
    type: String,
  },
  password: { type: String, minlength: 3 },
});

export const User = mongoose.model("User", userSchema);
