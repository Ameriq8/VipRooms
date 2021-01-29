const Discord = require("discord.js");
const error = require("../../helpers/error");

module.exports = {
    name: "ping",
    aliases: [],
    permissions: [],
    enabled: true,
    cooldown: 5,
    prime: false,
    exec: async (client, message) => {
        try {
      message.channel.send(`Pinging...`).then(async m => {
        let latencyPing = Math.floor(
          m.createdTimestamp - message.createdTimestamp
        );

        m.delete({ timeout: 2000 });
      
      setTimeout(() => {
        let sentence =
          `$My Latency: ` +
          "`" +
          `${latencyPing}ms` +
          "`" +
          `\nAPI Latency: ` +
          "`" +
          `${client.ws.ping}ms` +
          "`";
          
        message.channel.send(sentence);
      }, 2500);
      
      });
    } catch (err) {
      console.log(this.name + " Error:\n" + err);
      return error(
        "An error occurred while trying to run this command", message.channel
      );
    }
    }
}