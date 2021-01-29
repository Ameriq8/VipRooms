const userModel = require("../models/userModel"),
  memberModel = require("../models/memberModel"),
  guildModel = require("../models/guildModel"),
  primeModel = require("../models/primeModel");
const { MessageEmbed, Collection } = require("discord.js");
const cooldowns = new Collection();

module.exports = async message => {
  if (message.author.bot || !message.guild) return;
  let user = await userModel.findOne({ userID: message.author.id });
  let guild = await guildModel.findOne({ guildID: message.guild.id });
  let member = await memberModel.findOne({
    memberID: message.author.id,
    guildID: message.guild.id
  });

  if (!user) {
    user = new userModel({
      userID: message.author.id,
      userName: message.author.username
    });
    await user.save().catch(err => console.log(err));
  }

  if (!guild) {
    guild = new guildModel({ guildID: message.guild.id });
    await guild.save().catch(err => console.log(err));
  }

  if (!member) {
    member = new memberModel({
      memberID: message.author.id,
      guildID: message.guild.id
    });
    await member.save().catch(err => console.log(err));
  }

  const prefixMention = new RegExp(`^<@!?${message.client.user.id}>`);

  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${guild.prefix}\``);
  }

  if (message.content.indexOf(guild.prefix) !== 0) return;

  let args = message.content
    .slice(guild.prefix.length)
    .trim()
    .split(/ +/g);

  let command = args.shift();
  if (message.client.commands.has(command))
    cmdFile = message.client.commands.get(command);
  else if (message.client.aliases.has(command))
    cmdFile = message.client.aliases.get(command);
  else return;

  if (!cmdFile.enabled)
    return await message.channel.send("This command is disabled");

  if (
    cmdFile.ownerOnly &&
    !message.client.config.owners.includes(message.author.id)
  )
    return; //await message.channel.send("This command for ownerOnly.");

  if (
    cmdFile.permissions &&
    !(
      message.client.config.owners.includes(message.author.id) ||
      message.member.permissions.has(cmdFile.permissions)
    )
  )
    return await message.channel.send(
      `You need \`${cmdFile.permissions.join(
        ", "
      )}\` permissions to use this command.`
    );

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (cmdFile.cooldown || 5) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message
        .reply(
          `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command}\` command.`
        )
        .delete({ timeout: 5000 });
    }
  }
  // Prime
  let prime = await primeModel.findOne({ guildID: message.guild.id });

  if (cmdFile.prime) {
    if (!prime)
      return message.channel.send(
        "This command for Prime Subscribers. If you need to use this command buy Prime Subscribe to unlock all Prime Features in this server"
      );
  }

  cmdFile.exec(message.client, message, args);

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
};
