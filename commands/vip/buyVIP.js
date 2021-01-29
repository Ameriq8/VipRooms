const { MessageEmbed } = require("discord.js");
const guildModel = require("../../models/guildModel");
const memberModel = require("../../models/memberModel");
const vipModel = require("../../models/vipModel");

module.exports = {
	name: "buy-vip",
	aliases: ["buyvip"],
	permissions: [],
	usage: "",
	description: "",
	ownerOnly: false,
	enabled: true,
	cooldown: 5,
	exec: async (client, message, args) => {
		let guild = await guildModel.findOne({ guildID: message.guild.id });
		let member = await memberModel.findOne({ memberID: message.author.id, guildID: message.guild.id });
		let vip = await vipModel.findOne({ memberID: message.author.id, guildID: message.guild.id });
		
		if (member.points < 50) return message.channel.send("**You don't have 50 points to buy VIP room**");
		
		if (vip) return message.channel.send("**You already have vip rom**");

		if (!vip) {
			message.channel.send("**Now you have vip room**");
			member.points -= 50;
			member.save();
			
			if (!guild.settings.vip.category && !guild.settings.vip.channel && !guild.settings.vip.role) {
				let vipCategory = message.guild.channels.cache.find(i => i.name == "VIP ROOMS");
				let vipChannel = message.guild.channels.cache.find(i => i.name == "vip-subscribers");
				let vipRole = message.guild.roles.cache.find(i => i.name == "VIP");

				if (!vipCategory) vipCategory = await message.guild.channels.create("VIP ROOMS", {
					type: "category",
					reason: "I can't find VIP Rooms category in this server"
				});

				if (!vipChannel) vipChannel = await message.guild.channels.create("vip-subscribers", {
					type: "text",
					reason: "I can't find VIP Subscribers channel in this server"
				});
				
				if (!vipRole) vipRole = await message.guild.roles.create({
          date: {
            name: "VIP"
          }
        });

				message.guild.channels
					.create(message.author.username, {
						type: "voice",
						parent: vipCategory.id,
						permissionOverwrites: [
							{
								id: message.guild.id,
								deny: [
								"CONNECT",
								"SPEAK",
								"CREATE_INVITE"
							]
            },
							{
								id: client.user,
								allow: [
                "CONNECT",
                "SPEEK",
                "CREATE_INVITE"
              ]
            },
							{
								id: message.member,
								allow: [
                "CONNECT",
                "SPEAK",
                "CREATE_INVITE"
              ]
            }
           ],
						reason: "This user buy VIP room."
					}).then(ch => {
						let time = new Date().getTime();

						vip = new vipModel({
							memberID: message.author.id,
							guildID: message.guild.id,
							channelID: ch.id,
							timestamp: time,
							endsAt: time + 2628002880
						});

						await vip.save({}, async err => {
							if (err) return console.error(err);

							let channel = message.guild.channels.cache.find(i => i.name == "vip-subscribers");
							let embed = new MessageEmbed()
								.setTitle("Subscribe Informations")
								.addField("Member", message.author + " `(" + message.author.id + ")`")
								.addField("Timestamp", "`" + moment(time).calendar() + "`")
								.addField("End At", "`" + moment(time).add(30, 'days').calendar() + "`")
								.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
								.setFooter(`Request by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
								.setTimestamp();
							
							channel.send(embed);
							message.author.roles.add(vipRole.id);
							
							guild.settings.vip.category = vipCategory.id;
							guild.settings.vip.channel = vipChannel.id;
							guild.settings.vip.role = vipRole.id
							guild.markModified("settings.vip");
							guild.save();
						});
					});
			} else {
				
				message.guild.channels
					.create(message.author.username, {
						type: "voice",
						parent: guild.settings.vip.category,
						permissionOverwrites: [
							{
								id: message.guild.id,
								deny: [
								"CONNECT",
								"SPEAK",
								"CREATE_INVITE"
								]
            },
							{
								id: client.user,
								allow: [
                "CONNECT",
                "SPEEK",
                "CREATE_INVITE"
              ]
            },
							{
								id: message.member,
								allow: [
                "CONNECT",
                "SPEAK",
                "CREATE_INVITE"
              ]
            }
           ],
						reason: "This user buy VIP room."
					}).then(ch => {
						let time = new Date().getTime();
						
						vip = new vipModel({
							memberID: message.author.id,
							guildID: message.guild.id,
							channelID: ch.id,
							timestamp: time,
							endsAt: time + 2628002880
						});

						await vip.save({}, async err => {
							if (err) return console.error(err);

							let channell = message.guild.channels.cache.get(guild.settings.vip.channel);
							let vipRolee = message.guild.roles.cache.get(guild.settings.vip.role);
							let embed = new MessageEmbed()
								.setTitle("Subscribe Informations")
								.addField("Member", message.author + " `(" + message.author.id + ")`")
								.addField("Timestamp", "`" + moment(time).calendar() + "`")
								.addField("End At", "`" + moment(time).add(30, 'days').calendar() + "`")
								.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
								.setFooter(`Request by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
								.setTimestamp();

							channell.send(embed);
							message.author.roles.add(vipRolee.id);
						});
					});
			}
		}
	}
}