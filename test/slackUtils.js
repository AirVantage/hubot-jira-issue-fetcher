import test from 'ava';
import slackUtils from '../lib/slackUtils';

test('is bot message', (t) => {
  const message = {
    text: 'Text',
    rawMessage: {
      type: 'message',
      subtype: 'bot_message',
    },
    _channel_id: 'C9FS6EQP9',
    id: '1589104308.091600',
  };
  t.is(slackUtils.isBotMessage(message), true);
});

test('is direct message', (t) => {
  const message = {
    user: { room: 'C9FS6EQP9' },
    text: 'botName The Text sent directly',
    rawMessage: {},
    _channel_id: 'C9FS6EQP9',
    id: '1589104308.091600',
  };
  const botName = 'botName';
  t.is(slackUtils.isDirectMessage(message.text, botName), true);
});
