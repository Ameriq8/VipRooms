const { Schema, model } = require("mongoose");

const guildSchema = Schema({
			guildID: {
				type: String,
				required: true
			},
			prefix: {
				type: String,
				required: true
			},
			settings: {
				type: Object,
				required: true,
				default: {
					vip: {
						enabled: null,
						category: null,
						channel: null,
						role: null
					}
				}
			});

		module.exports = model("guildModel", guildSchema);