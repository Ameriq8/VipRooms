const { Schema, model } = require("mongoose");

const vipSchema = Schema({
	memberID: {
    type: String,
    required: true
  },
  guildID: {
    type: String,
    required: true
  },
  channelID: {
    type: String,
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

module.exports = model("vipModel", vipSchema);
