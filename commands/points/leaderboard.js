const { MessageEmbed } = require("discord.js");
const memberModel = require("../../models/memberModel");

module.exports = {
  name: "leaderboard",
  aliases: ["lb"],
  permissions: [],
  usage: "",
  description: "",
  ownerOnly: false,
  enabled: true,
  cooldown: 5,
  exec: async (client, message, args) => {
    memberModel.find({ guildID: message.guild.id })
      .sort([["points", "descending"]])
      .exec((err, res) => {
        if (err) console.log(err);

        let i = null;

        let embed = new MessageEmbed()
          .setAuthor(
            `Guild Points Leaderboard`,
            client.user.displayAvatarURL({ dynamic: true })
          )
          .setThumbnail(message.guild.iconURL({ dynamic: true }));
          
        if (res.length === 0) {
          embed.setColor("RED");
          embed.addField("No data found", "I can't find anyone have points in this server");
        } else if (res.length < 10) {
        	
          embed.setColor("#D3D3D3");
          for (i = 0; i < res.length; i++) {
            let member =
              client.users.cache.find(user => user.id == res[i].userID) ||
              res[i].userName;
            if (member === res[i].userName) {
              embed.addField(
                `*\`#\`* ${i + 1} | __${member}__`,
                `**\`&\`** **Points**: \` ${res[i].points} \``
              );
            } else {
            	
              embed.addField(
                `*\`#\`* ${i + 1} | __${member.tag}__`,
                `**\`&\`** **Points**: \` ${res[i].points} \``
              );
            }
          }
        } else {
        	
          embed.setColor("#D3D3D3");
          for (i = 0; i < 10; i++) {
            let member =
              client.users.cache
                .filter(sss => sss.id == res[i].userID)
                .find(user => user.id == res[i].userID) || res[i].userName;

            if (member === res[i].userName) {
              embed.addField(
                `*\`#\`* ${i + 1} | __${member}__`,
                `**\`&\`** **Points**: \` ${res[i].points} \``
              );
            } else {
              embed.addField(
                `*\`#\`* ${i + 1} | __${member.tag}__`,
                `**\`&\`** **Points**: \` ${res[i].points} \``
              );
            }
          }
        }

        message.channel.send(embed);
      });
  }
};
