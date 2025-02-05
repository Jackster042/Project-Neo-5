const { Schema, model } = require("mongoose");

const bcryptjs = require("bcryptjs");
const SALT = 12;

// TODO: ADD REGEX FOR USERNAME ( XSS PREVENTION )
const regexUsername = /^[a-zA-Z0-9_]{3,16}$/;

const regexPassword =
  /^(?=.*[1-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])\S{8,16}$/;

const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    unique: true,
    // TODO: EMAIL VALIDATION
    match: [regexEmail, "Email is invalid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  city: { type: String },
  postCode: { type: String },
  votedFor: { type: String },
  refreshToken: { type: String },
});

// TODO: PASSWORD VALIDATION
UserSchema.path("password").validate(function (password) {
  return regexPassword.test(password); // VALIDATE RAW PASSWORD
}, "Password is invalid");

// PRE-SAVE
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, SALT);
});

// METHODS
UserSchema.methods.isCorrectPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

const UserModel = model("users", UserSchema);
module.exports = UserModel;
