const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences,
	],
});
client.commands = new Collection();
client.queues = new Collection();
client.prefix = process.env.PREFIX;

require('./handlers/commandLoader')(client);
require('./handlers/eventLoader')(client);

// Login to Discord with your client's token
client.login(process.env.TOKEN);