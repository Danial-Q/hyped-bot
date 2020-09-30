const moment = require('moment');

const momentDate = (date) => {
	return moment(date, 'DD/MM');
};

module.exports = {momentDate};
