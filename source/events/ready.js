const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {

		let status = {
			name: 'with Puffy!',
			type: ActivityType.Playing
		}

		client.user.setActivity(status);
		console.log('BOT IS ONLINE');
	},
};