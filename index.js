const { Client, Collection } = require("discord.js");
const Mongoose = require("mongoose");
const client = new Client();

client.config = require("./config");

Mongoose.connect(client.config.mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.database = Mongoose.connection;
client.database.on("error", err => {
  throw err;
});

client.database.once("open", async () => {
  require("./handlers/eventHandler")(client);
  require("./handlers/moduleHandler")(client);
  client.login(client.config.bot_token);
});
