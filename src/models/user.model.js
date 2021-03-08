const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    match: /^[A-Za-z]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const rounds = 12;
    this.password = await bcrypt.hash(this.password, rounds);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
