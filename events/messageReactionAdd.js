const moment = require('moment');
const {momentDate} = require('../utils/momentDate');

module.exports = (client, reaction, user) => {
	const {channelIDs, guildID, msgIDs} = client.config;
	const guildObj = client.guilds.cache.get(guildID);
	const adminAbsence = guildObj.channels.cache.get(channelIDs.adminAbsence);

	if (reaction.message.channel === client.channels.cache.get(channelIDs.raiderAbsence)) {
		if (reaction.emoji.name === '👍') {
			const messageSplit = reaction.message.content.split('\n');
			const raiderAbsent = reaction.message.author;
			const reason = messageSplit[0].substring(7);
			const startDate = momentDate((messageSplit[1].substring(11).replace(/\s/g, '')));
			const endDate = momentDate((messageSplit[2].substring(9).replace(/\s/g, '')));
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

			reaction.message.author.send(`${user.username} has seen the absence and it has been noted!`);
			reaction.message.delete();
		}
	}

};
