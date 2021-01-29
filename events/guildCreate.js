const guildModel = require("../models/guildModel");

module.exports = async guild => {
  await guildModel.create({
    guildID: guild.id,
    prefix: "sp"
  });

  console.log(`JOINED GUILD: ${guild.name} | ${guild.id}`);
};
//(`JOINED GUILD: ${guild.name} | ${guild.id}`);
