const { MessageEmbed } = require("discord.js");

module.exports = async (text, channel, user) => {
  let embed = new MessageEmbed()
    .setTitle("Error")
    .setDescription(text)
    .setFooter("Oops something went wrong :(");
  await channel.send(embed);
};
