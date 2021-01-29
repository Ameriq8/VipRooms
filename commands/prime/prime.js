const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const primeModel = require("../../models/primeModel");

module.exports = {
  name: "prime",
  aliases: [],
  permissions: [],
  usage: "",
  description: "",
  ownerOnly: false,
  enabled: true,
  prime: true,
  cooldown: 5,
  exec: async (client, message, args) => {
    let prime = await primeModel.findOne({ guildID: message.guild.id });

    if (prime.ownerID !== message.author.id) {
      // No Thing to do
    } else {
      
      message.channel.send(
        `**Prime Subscribe will end at ${moment(prime.endsAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        )}.**`
      );
    }
  }
};
