const config = require('../config.json');
const {writeFile} = require('fs');

module.exports = {
	name: 'init',
	adminOnly: true,
	execute(message) {
		const {channelIDs} = message.client.config;

		if (!message.client.config.absenceInitialise) {
			message.client.channels.cache.get(channelIDs.adminAbsence).send('***LONG TERM ABSENCES***\n').then(sentMsg => {
				config.msgIDs.longTerm = sentMsg.id.toString();
			});

			message.client.channels.cache.get(channelIDs.adminAbsence).send('-------------------------------------------------------------------------------------------------------------\n***SHORT TERM ABSENCES***\n').then(sentMsg => {
				config.msgIDs.shortTerm = sentMsg.id.toString();
				config.absenceInitialise = true;

				writeFile('config.json', JSON.stringify(config), (err) => {
					if (err) {
						throw err;
					}
				});
				message.react('✅');
			});
		} else {
			message.channel.send('Absence msgs have been initalised already!');
		}
	}

};
