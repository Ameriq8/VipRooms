const { MessageEmbed } = require("discord.js"),
	memberModel = require("../../models/memberModel"),
	error = require("../../helpers/error");

module.exports = {
	name: "points",
	aliases: [],
	permissions: [],
	usage: "",
	description: "",
	ownerOnly: false,
	enabled: true,
	cooldown: 5,
	exec: async (client, message, args) => {
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

		let member = await memberModel.findOne({ memberID: user.user.id, guildID: message.guild.id });

		message.channel.send(`**${user.user.username} have \`${member.points}\`.**`);
	}
};