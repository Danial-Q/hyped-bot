const config = require('../config.json');

module.exports = {
	name: 'summon',
	adminOnly: true,
	execute(message) {
		const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
		const {roleIDs, channelIDs} = config;

		voiceChannels.each(channel => {
			channel.members.each(member => {
				if (member.roles.cache.has(roleIDs.raiders) || member.roles.cache.has(roleIDs.trials)) {
					member.voice.setChannel(channelIDs.raidVoice);
				}
			});
		});

		message.react('✅');
	}
};
