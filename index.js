const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { AttachmentBuilder, Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Define el evento cuando el bot está listo
client.once('ready', () => {
    console.log('¡Bot listo!');
});

client.on('messageCreate', async message => {
    if (message.content === '!stock') {
        // Leer el archivo stock.txt
        const data = fs.readFileSync('stock.txt', 'utf8');
        const goldMatch = data.match(/let gold = "(.*)";/);
        let gold = goldMatch ? goldMatch[1] : 'Valor no encontrado'; // Extraer el valor de gold

        const memberMatch = data.match(/let member = "(.*)";/);
        let member = memberMatch ? memberMatch[1] : 'Valor no encontrado'; // Extraer el valor de member

        if (gold === '0' || gold === '0M') {
            gold = 'Out';
        }

        if (member === '0' || member === '0M') {
            member = 'Out';
        }

        // Cargar la imagen preestablecida
        const image = await loadImage('image.jpg');
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // Dibujar la imagen en el canvas
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // Añadir texto encima de la imagen
        ctx.font = '100px Arial';
        ctx.fillStyle = 'white';
        const textGold = `OSRS Gold: ${gold}`; // Texto predefinido junto con el valor de gold
        const textMember = `Memberships: ${member}`; // Texto predefinido junto con el valor de member
        const textGoldWidth = ctx.measureText(textGold).width;
        const textMemberWidth = ctx.measureText(textMember).width;

        // Condicional para cambiar la imagen del icono
        const iconGoldPath = gold === 'Out' ? 'icon2.png' : 'icon.png';
        const iconMemberPath = member === 'Out' ? 'icon2.png' : 'icon.png';
        const iconGold = await loadImage(iconGoldPath);
        const iconMember = await loadImage(iconMemberPath);
        const iconWidth = 100;

        // Posiciones para el texto y los iconos
        const xGold = (image.width - textGoldWidth - iconWidth) / 2;
        const yGold = image.height / 2 - 50;
        const xMember = (image.width - textMemberWidth - iconWidth) / 2;
        const yMember = image.height / 2 + 50;

        // Dibujar texto y iconos
        ctx.fillText(textGold, xGold, yGold);
        ctx.drawImage(iconGold, xGold + textGoldWidth + 10, yGold - 75, iconWidth, iconWidth);
        ctx.fillText(textMember, xMember, yMember);
        ctx.drawImage(iconMember, xMember + textMemberWidth + 10, yMember - 75, iconWidth, iconWidth);

        // Crear un buffer de la imagen
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync('./imagen_modificada.png', buffer);

        // Enviar la imagen modificada en el canal de Discord
        const attachment = new AttachmentBuilder(buffer, { name: 'imagen_modificada.png' });
        message.channel.send({ files: [attachment] });
    }
});






client.login(token);
