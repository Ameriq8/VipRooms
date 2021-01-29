const { Schema, model } = require("mongoose");

const userSchema = Schema({
  userID: {
    type: String
  },
  userName: {
    type: String
  }
});

module.exports = model("userModel", userSchema);
