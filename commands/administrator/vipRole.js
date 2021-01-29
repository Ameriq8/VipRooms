const { MessageEmbed } = require("discord.js");
const error = require("../../helpers/error");
const guildModel = require("../../models/guildModel");

module.exports = {
	name: "vip-role",
	aliases: ["viprole"],
	permissions: ["MANAGE_GUILD"],
	usage: "",
	description: "",
	ownerOnly: false,
	enabled: false,
	cooldown: 5,
	exec: async (client, message, args) => {
		let guild = await guildModel.findOne({ guildID: message.guild.id });
		let role =
			message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

		if (!role) return message.channel.send("**I can't find this role**");

		guild.settings.tickets.role = role.id;
		guild.markModified("settings.vip");
		guild.save({}, async err => {
			if (err) return console.error(err);
			await message.channel.send(
				`**Done, now VIP role is <@&${role.id}>**`
			);
		});
	}
};