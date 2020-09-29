const config = require('../config.json');
const {writeFile} = require('fs');

module.exports = {
	name: 'prefix',
	adminOnly: true,
	execute(message, args) {
		const desiredPrefix = args[0];

		if (!desiredPrefix) {
			message.reply('Please include a prefix to change to!');
			return;
		}

		config.prefix = `${desiredPrefix}`;
		writeFile('config.json', JSON.stringify(config), (err) => {
			if (err) {
				throw err;
			}
		});
		message.react('✅');
	}
};
