const { MessageEmbed } = require("discord.js"),
	ms = require("parse-ms"),
	memberModel = require("../../models/memberModel"),
	error = require("../../helpers/error");

module.exports = {
	name: "manage-points",
	aliases: ["manage-points"],
	permissions: ["MANAGE_GUILD"],
	usage: "",
	description: "",
	ownerOnly: false,
	enabled: true,
	cooldown: 5,
	exec: async (client, message, args) => {
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		let member = await memberModel.findOne({ memberID: user.user.id, guildID: message.guild.id });
		
		if (args[1] == "add") {
		 
			member.points += parseInt(args[2]);
			member.save();
			message.channel.send(`**Done add \`${args[2]}\` points to ${user.user.username}.**`);
		} else if (args[1] == "remove") {
			
			let _ = parseInt(args[2]);
			if (_ > member.points) return message.channel.send("**This user don't have this amount from points.**");
			
			member.points -= parseInt(args[2]);
			member.save();
			message.channel.send(`**Done remove \`${args[2]}\` points to ${user.user.username}.**`);
		} else if (args[1] == "reset") {
			
			if (member.points == 0) return message.channel.send("**This user don't have this points to reset.**");
			
			member.points = 0;
			member.save();
			message.channel.send(`**Done reset ${user.user.username} points.**`);
		}
	}
};