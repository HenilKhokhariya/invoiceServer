const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fname: { type: String, require: true },
  lname: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  date_time: { type: String, require: true },
});

const userLoginSchema = mongoose.Schema({
  email: { type: String, require: true },
  date_time: { type: String, require: true },
});

const User = mongoose.model("User", userSchema);
const UserLogin = mongoose.model("Login", userLoginSchema);

module.exports = { User, UserLogin };
