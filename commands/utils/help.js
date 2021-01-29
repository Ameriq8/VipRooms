const { MessageEmbed } = require("discord.js");
const error = require("../../helpers/error");
const guildModel = require("../../models/guildModel");

module.exports = {
  name: "help",
  aliases: [],
  permissions: [],
  usage: "",
  description: "",
  ownerOnly: false,
  enabled: true,
  cooldown: 5,
  exec: async (client, message, args) => {
    let guild = await guildModel.findOne({ guildID: message.guild.id });

    if (!args[0]) {
      const embed = new MessageEmbed()
        .setDescription(
          `For more information about a command, use \`${guild.prefix}help <command_name>\` command\nNote: (p) => Prime Features`
        )
        .addField(
          "Administrator",
          `\`modlog\``
        )
        .addField(
          "Moderation",
          `\`ban\`, \`kick\`, \`mute\`, \`unmute\`, \`clear\``
        )
       /* .addField(
          "Tickets",
          `\`new\`, \`close\`, \`add\`, \`remove\`, \`rename\``
        )*/
        .addField("Economy", `\`credits\`, \`daily\`, \`transfer\`, \`leaderboard\``)
        .addField("General", `\`help\`, \`ping\`, \`invite\` \`server\``)
        .setColor("GREEN")
        .setTimestamp(new Date());

      /* const help = {};
      client.commands.forEach(command => {
        const cat = command.module;
        if (!help.hasOwnProperty(cat)) help[cat] = [];

        help[cat].push("`" + command.name + "`");
      });
      let str = "";
      for (let category in help) {
        embed.addField(
          `**${category.charAt(0).toUpperCase() + category.slice(1)}**`,
          help[category].join(" | ")
        );
      }*/

      await message.channel.send(embed);
    } else {
      let command = args[0];

      if (client.commands.has(command) || client.aliases.has(command)) {
        command = client.commands.get(command) || client.aliases.get(command);

        const embed = new MessageEmbed()
          .setTitle(command.name)
          .addField("Name", command.name)
          .addField(
            "Required Permissions",
            command.permissions[0]
              ? "```" + command.permissions.join(", ") + "```"
              : "Not Found"
          )
          .addField(
            "Aliases",
            command.aliases[0]
              ? "`" + command.aliases.join("`, `") + "`"
              : "Not Found"
          )
          .setColor("GREEN")
          .setTimestamp(new Date());

        await message.channel.send(embed);
      } else {
        message.channel.send(`Command with name \`${command}\` not found`);
      }
    }
  }
};
