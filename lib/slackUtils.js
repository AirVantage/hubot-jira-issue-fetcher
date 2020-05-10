const _ = require('lodash');

module.exports = {
  isBotMessage: (inputMessage) => _.get(inputMessage, 'rawMessage.subtype') === 'bot_message',
  isDirectMessage: (inputMessage, botName) => inputMessage && inputMessage.indexOf(botName) !== -1,
};
