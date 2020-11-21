const moment = require('moment');
const {momentDate} = require('./momentDate');

const absenceRemoval = (client) => {
	const {channelIDs, guildID, msgIDs} = client.config;
	const guildObj = client.guilds.cache.get(guildID);
	const adminAbsence = guildObj.channels.cache.get(channelIDs.adminAbsence);
	const currentDate = moment();
	let longTerm, shortTerm;
	let longTermFound, shortTermFound = false;

	adminAbsence.messages.fetch(msgIDs.longTerm).then(longMsg => {
		longTerm = longMsg.content;

		adminAbsence.messages.fetch(msgIDs.shortTerm).then(shortMsg => {
			shortTerm = shortMsg.content;

			const shortAbsencePostArray = shortTerm.split('**Raider:**').slice(1);
			const longAbsencePostArray = longTerm.split('**Raider:**').slice(1);
			const absencePostArray = shortAbsencePostArray.concat(longAbsencePostArray);

			for (const absencePost of absencePostArray) {
				const indexOfEndDate = absencePost.indexOf('**End Date:**') + 14;
				const endDate = momentDate(absencePost.slice(indexOfEndDate, indexOfEndDate + 5));

				if (endDate.isBefore(currentDate) && !endDate.isSame(currentDate, 'd')) {
					if (shortAbsencePostArray.includes(absencePost)) {
						shortTerm = shortTerm.replace(`**Raider:**${absencePost}`, '');
						shortTermFound = true;
					} else {
						longTerm = longTerm.replace(`**Raider:**${absencePost}`, '');
						longTermFound = true;
					}
				}
			}

			if (shortTermFound) {
				adminAbsence.messages.fetch(msgIDs.shortTerm).then(msgToEdit => {
					msgToEdit.edit(shortTerm);
					shortTermFound = false;
				});
			}

			if (longTermFound) {
				adminAbsence.messages.fetch(msgIDs.longTerm).then(msgToEdit => {
					msgToEdit.edit(longTerm);
					longTermFound = false;
				});
			}
		});
	});
};

module.exports = {absenceRemoval};
