const { Schema, model } = require("mongoose");

const primeSchema = Schema({
  guildID: {
    type: String,
    required: true
  },
  ownerID: {
    type: String,
    required: true
  },
  primeStatus: {
    type: Boolean,
    required: true
  },
  timestamp: {
    type: Date, 
    required: true
  },
  endsAt: {
    type: Date,
    required: true
  }
});

module.exports = model("primeModel", primeSchema);
