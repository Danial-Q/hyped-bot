const moment = require('moment');

module.exports = {
	name: 'absent',
	adminOnly: true,
	execute(message) {
		const {channelIDs, guildID, msgIDs} = message.client.config;
		const guildObj = message.client.guilds.cache.get(guildID);
		const adminAbsence = guildObj.channels.cache.get(channelIDs.adminAbsence);
		const currentDate = moment();
		const currentDay = currentDate.isoWeekday();
		const raidDays = [3, 4, 7];
		let absentList = 'Raiders Absent for next raid:\n';
		let absenceAdded = false;
		let longTerm, shortTerm;

		adminAbsence.messages.fetch(msgIDs.longTerm).then(longMsg => {
			longTerm = longMsg;

			adminAbsence.messages.fetch(msgIDs.shortTerm).then(shortMsg => {
				shortTerm = shortMsg;

				const shortAbsencePostArray = shortTerm.content.split('**Raider:**').slice(1);
				const longAbsencePostArray = longTerm.content.split('**Raider:**').slice(1);
				const absencePostArray = shortAbsencePostArray.concat(longAbsencePostArray);

				if (raidDays.includes(currentDay)) {
					for (const absencePost of absencePostArray) {
						const raiderAbsent = absencePost.slice(0, 22);
						const indexOfStartDate = absencePost.indexOf('**Start Date:**') + 16;
						const startDate = absencePost.slice(indexOfStartDate, indexOfStartDate + 5);
						const indexOfEndDate = absencePost.indexOf('**End Date:**') + 14;
						const endDate = absencePost.slice(indexOfEndDate, indexOfEndDate + 5);
						let isAbsent;

						if (currentDate.isSame(moment(startDate, 'DD/MM'), 'd')) {
							isAbsent = true;
						} else {
							isAbsent = moment(currentDate).isBetween(moment(startDate, 'DD/MM'), moment(endDate, 'DD/MM'), 'd');
						}

						if (isAbsent) {
							absentList += `-${raiderAbsent}\n`;
							absenceAdded = true;
						}

						if (moment(endDate, 'DD/MM').isBefore(currentDate) && !moment(endDate, 'DD/MM').isSame(currentDate, 'd')) {
							if (shortAbsencePostArray.includes(absencePost)) {
								adminAbsence.messages.fetch(msgIDs.shortTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							} else {
								adminAbsence.messages.fetch(msgIDs.longTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							}

						}
					}

					if (absenceAdded) {
						message.channel.send(absentList);
					} else {
						message.channel.send('There are no absences for next raid!');
					}

				} else if (currentDay < 3) {
					const nextRaid = moment().add(3 - currentDay, 'days');

					for (const absencePost of absencePostArray) {
						const raiderAbsent = absencePost.slice(0, 22);
						const indexOfStartDate = absencePost.indexOf('**Start Date:**') + 16;
						const startDate = absencePost.slice(indexOfStartDate, indexOfStartDate + 5);
						const indexOfEndDate = absencePost.indexOf('**End Date:**') + 14;
						const endDate = absencePost.slice(indexOfEndDate, indexOfEndDate + 5);
						let isAbsent;

						if (nextRaid.isSame(moment(startDate, 'DD/MM'), 'd')) {
							isAbsent = true;
						} else {
							isAbsent = moment(nextRaid).isBetween(moment(startDate, 'DD/MM'), moment(endDate, 'DD/MM'), 'd');
						}

						if (isAbsent) {
							absentList += `-${raiderAbsent}\n`;
							absenceAdded = true;
						}

						if (moment(endDate, 'DD/MM').isBefore(nextRaid) && !moment(endDate, 'DD/MM').isSame(nextRaid, 'd')) {
							if (shortAbsencePostArray.includes(absencePost)) {
								adminAbsence.messages.fetch(msgIDs.shortTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							}
						}
					}

					if (absenceAdded) {
						message.channel.send(absentList);
					} else {
						message.channel.send('There are no absences for next raid!');
					}

				} else if (currentDay > 3) {
					const nextRaid = moment().add(7 - currentDay, 'days');

					for (const absencePost of absencePostArray) {
						const raiderAbsent = absencePost.slice(0, 22);
						const indexOfStartDate = absencePost.indexOf('**Start Date:**') + 16;
						const startDate = absencePost.slice(indexOfStartDate, indexOfStartDate + 5);
						const indexOfEndDate = absencePost.indexOf('**End Date:**') + 14;
						const endDate = absencePost.slice(indexOfEndDate, indexOfEndDate + 5);
						let isAbsent;

						if (nextRaid.isSame(moment(startDate, 'DD/MM'), 'day')) {
							isAbsent = true;
						} else {
							isAbsent = moment(nextRaid).isBetween(moment(startDate, 'DD-MM'), moment(endDate, 'DD/MM'), 'd');
						}

						if (isAbsent) {
							absentList += `-${raiderAbsent}\n`;
							absenceAdded = true;
						}

						if (moment(endDate, 'DD/MM').isBefore(nextRaid) && !moment(endDate, 'DD/MM').isSame(nextRaid, 'd')) {
							if (shortAbsencePostArray.includes(absencePost)) {
								adminAbsence.messages.fetch(msgIDs.shortTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							}
						}
					}

					if (absenceAdded) {
						message.channel.send(absentList);
					} else {
						message.channel.send('There are no absences for next raid!');
					}

				}
			});
		});

	}
};
