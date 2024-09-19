const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('calc')
		.setDescription('calculate whatever')
		.addStringOption(option => option.setName('calculate').setDescription('Enter and do your calculations (only basic mathematical operators)').setRequired(true)),
	async execute(interaction) {
		const operacion = interaction.options.getString('calculate');
		try {
			const resultado = eval(operacion);
			await interaction.reply(`${operacion} = ${resultado}`);
		} catch (error) {
			await interaction.reply('Error al realizar la operacion');
		}
	},
};
