const moment = require('moment');

module.exports = (client, reaction) => {
	const {channelIDs, guildID, msgIDs} = client.config;
	const guildObj = client.guilds.cache.get(guildID);
	const adminAbsence = guildObj.channels.cache.get(channelIDs.adminAbsence);

	if (reaction.message.channel === client.channels.cache.get(channelIDs.raiderAbsence)) {
		if (reaction.emoji.name === '👍') {
			const messageSplit = reaction.message.content.split('\n');
			const raiderAbsent = reaction.message.author;
			const reason = messageSplit[0].substring(7);
			const startDate = moment(messageSplit[1].substring(11).replace(/\s/g, ''), 'DD-MM');
			const endDate = moment(messageSplit[2].substring(9).replace(/\s/g, ''), 'DD-MM');
			const daysDiff = moment.duration(endDate.diff(startDate));
			const daysDuration = Math.round(moment.duration(daysDiff).asDays()) + 1;

			if (daysDuration < 8) {
				adminAbsence.messages.fetch(msgIDs.shortTerm).then(msg => {
					msg.edit(`${msg.content}\n\n**Raider:** ${raiderAbsent}\n**Reason:** ${reason}\n**Start Date:** ${startDate.format('DD/MM')}\n**End Date:** ${endDate.format('DD/MM')}\n`);
				});
			} else {
				adminAbsence.messages.fetch(msgIDs.longTerm).then(msg => {
					msg.edit(`${msg.content}\n\n**Raider:** ${raiderAbsent}\n**Reason:** ${reason}\n**Start Date:** ${startDate.format('DD/MM')}\n**End Date:** ${endDate.format('DD/MM')}\n`);
				});
			}
		}
	}

};
