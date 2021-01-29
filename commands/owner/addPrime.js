const { MessageEmbed } = require("discord.js"),
  error = require("../../helpers/error"),
  primeModel = require("../../models/primeModel");

module.exports = {
  name: "addprime",
  aliases: ["ap"],
  permissions: [],
  usage: "",
  description: "",
  ownerOnly: true,
  enabled: true,
  cooldown: 5,
  exec: async (client, message, args) => {
    if (!args[0])
      return message.channel.send(
        "**Send guildID to create new data for server in my database.**"
      );
    if (!args[1])
      return message.channel.send(
        "**Send ownerID to add the owner to prime database.**"
      );
    if (!args[2])
      return message.channel.send(
        "**Send subscribe type to add the time in database.**"
      );

    let prime = await primeModel.findOne({ guildID: args[0] });

    if (prime)
      return message.channel.send(
        "**This server is already have prime Subscribe**"
      );

    let tt;

    if (args[2] == "1m") {
      tt = 2628002880;
    } else if (args[2] == "3m") {
      tt = 7884008640;
    } else if (args[2] == "6m") {
      tt = 15768017280;
    } else if (args[2] == "1y") {
      tt = 31536000000;
    }

    if (!prime) {
      message.channel.send(
        "**Done, Add this server for Prime List. You can use all Prime Features now.**"
      );

      let time = new Date().getTime();

      prime = new primeModel({
        guildID: args[0],
        ownerID: args[1],
        primeStatus: true,
        timestamp: time,
        endsAt: time + tt
      });
      await prime.save({}, async err => {
        if (err) return console.error(err);
      });
    }
  }
};
