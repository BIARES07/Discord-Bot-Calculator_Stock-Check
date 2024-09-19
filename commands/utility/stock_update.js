const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs'); // Add this line to require the fs module

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stock_update')
		.setDescription('update the stock')
		.addStringOption(option => option.setName('gold').setDescription('Set gold').setRequired(true))
		.addStringOption(option => option.setName('member').setDescription('Set Memberships').setRequired(true)),
	async execute(interaction) {
		const gold = interaction.options.getString('gold');
		const member = interaction.options.getString('member');

		const data = `let gold = "${gold}";\nlet member = "${member}";`;

		fs.writeFileSync('stock.txt', data);

		await interaction.reply(`Products updated: Gold = ${gold}, memberships = ${member}`);
	},
};
