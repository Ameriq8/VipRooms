const { Schema, model } = require("mongoose");

const memberSchema = Schema({
  memberID: {
    type: String,
    required: true
  },
  guildID: {
    type: String,
    required: true
  },
  points: {
  	type: Number,
  	default: 0
  }
});

module.exports = model("memberModel", memberSchema);
