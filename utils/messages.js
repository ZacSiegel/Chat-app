const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('MMM  Do h:mm a')
    }
}

module.exports = formatMessage;