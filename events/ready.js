const guildModel = require("../models/guildModel"),
  membersModel = require("../models/memberModel"),
  primeModel = require("../models/primeModel");

module.exports = async client => {
  client.user.setPresence({
    status: client.config.game.status,
    activity: {
      name:
        typeof client.config.game.name === "string"
          ? client.config.game.name
          : client.config.game.name instanceof Array
          ? client.config.game.name[0]
          : null,
      type: client.config.game.type
    }
  });
  if (
    client.config.game.name instanceof Array &&
    client.config.game.name.length
  ) {
    client.setInterval(async () => {
      let activity =
        client.config.game.name[
          Math.floor(Math.random() * client.config.game.name.length)
        ];
      await client.user.setActivity(activity, {
        type: client.config.game.type
      });
    }, ((typeof client.config.game.interval === "number" && client.config.game.interval) || 30) * 1000);
  }

  // Prime
  setInterval(async () => {
    let prime = await primeModel.find({});
    prime.map(async p => {
      if (new Date().getTime() > p.endsAt) {
        let pr = await primeModel.find({ _id: p._id });
        var cu = await client.users.cache.find(pr.ownerID);
        var cg = await client.guilds.cache.find(pr.guildID);
        if (pr.autoSub == true) {
          cu.send(
            `**Hey, Mr. ${cu.username}\nYour Prime Subscribe for \`${cg.name}\` guild, has been ended and ReSubscribe has been done.**`
          );
          pr.endsAt = new Date().getTime() + 60000 * 60 * 24 * 28;
          pr.save();
        } else {
          await cu.send(
            `**Hey, Mr. ${cu.username}\nYour Prime Subscribe for \`${
              cg.name
            }\` guild, has been ended.\nif you need to buy prime subscribe please enter \`${
              client.config.prefixes[0]
            }buyprime\` to enabled all Prime Features in your server.**`
          );
          await primeModel.findOneAndDelete({ _id: p._id });
        }
      }
    });
  }, 1000 * 60);

  process.stdout.write("\n");
  console.log("-------------------------------");
  console.log(`BOT: ${client.user.username} is ready!`);
  console.log(`PREFIXES: ${client.config.prefix}`);
  console.log(`GUILDS: ${client.guilds.cache.size}`);
  console.log(`CHANNELS: ${client.channels.cache.size}`);
  console.log(`USERS: ${client.users.cache.size}`);
  console.log(`BOOT TIME: ${process.uptime() * 1000}ms`);
};
