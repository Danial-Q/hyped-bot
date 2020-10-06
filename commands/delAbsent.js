const moment = require('moment');
const {momentDate} = require('../utils/momentDate');

module.exports = {
	name: 'delabsence',
	adminOnly: true,
	execute(message, args) {
		const {channelIDs, guildID, msgIDs} = message.client.config;
		const guildObj = message.client.guilds.cache.get(guildID);
		const adminAbsence = guildObj.channels.cache.get(channelIDs.adminAbsence);
		const fullMsg = args.join(' ');
		const messageSplit = fullMsg.split('\n');
		const raiderAbsent = message.mentions.users.first();
		const reason = messageSplit[1].substring(7);
		const startDate = momentDate((messageSplit[2].substring(11).replace(/\s/g, '')));
		const endDate = momentDate((messageSplit[3].substring(9).replace(/\s/g, '')));
		const daysDiff = moment.duration(endDate.diff(startDate));
		const daysDuration = Math.round(moment.duration(daysDiff).asDays()) + 1;
		const absenceToRemove = `**Raider:** ${raiderAbsent}\n**Reason:** ${reason}\n**Start Date:** ${startDate.format('DD/MM')}\n**End Date:** ${endDate.format('DD/MM')}`;

		if (daysDuration < 8) {
			adminAbsence.messages.fetch(msgIDs.shortTerm).then(shortMsg => {
				shortMsg.edit(`${shortMsg.content.replace(absenceToRemove, '')}`);
			});
		} else {
			adminAbsence.messages.fetch(msgIDs.longTerm).then(longMsg => {
				longMsg.edit(`${longMsg.content.replace(absenceToRemove, '')}`);
			});
		}

		message.react('✅');
	}
};
