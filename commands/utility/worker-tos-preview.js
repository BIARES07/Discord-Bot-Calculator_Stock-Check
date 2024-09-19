const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tos_prev')
        .setDescription('Worker TOS Preview'),
    async execute(interaction) {
        // Lee el contenido del archivo
        const contenido = fs.readFileSync('Worker_TOS.txt', 'utf8');

        const embed = {
            title: 'Worker TOS',
            description: contenido, // Usa el contenido del archivo aquí
            thumbnail: {
                url: 'https://i.postimg.cc/ydkZXxHH/pixil-frame-0.png',
            },
            footer: {
                text: 'Venox Gold',
                icon_url: 'https://i.postimg.cc/9MKqx2mq/Pre-comp-1-1.png',
            },
            color: 0x0099ff, // Cambia el valor a un número
        };

        await interaction.reply({ embeds: [embed] });
    },
};



