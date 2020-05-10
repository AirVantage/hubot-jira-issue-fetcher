const jira = require('./lib/jira');
const messageParser = require('./lib/messageParser');
const messageFormatter = require('./lib/messageFormatter');
const slackUtils = require('./lib/slackUtils');

const configuration = {
    jiraHost: process.env.JIRA_HOST,
    projectsKeys: process.env.JIRA_PROJECTS_KEYS.split(','),
    jiraUser: process.env.JIRA_USER,
    jiraPwd: process.env.JIRA_PWD,
  },
  jiraApi = jira(configuration),
  parser = messageParser(configuration),
  formatter = messageFormatter(configuration),
  JIRA_KEY_MATCHER = /[A-Z0-9]*-\d+/i;
let bot;

module.exports = (robot) => {
  bot = robot;
  bot.hear(JIRA_KEY_MATCHER, (res) => {
    if (slackUtils.isBotMessage(res.message)) {
      return;
    }

    let message = {
      room: res.message.user.room,
      text: res.message.text,
      needDetailedInfo: slackUtils.isDirectMessage(res.message.text, robot.name),
      thread_ts: res.message.thread_ts,
    };

    getIssues(parser.extractIssueKeys(message))
      .then(computeInfoLevel)
      .then(buildResponseMessage)
      .then(sendResponseMessage)
      .catch((err) => handleError(err, message));
  });
};

function getIssues(message) {
  message.issues = [];

  if (message.issueKeys.length) {
    return jiraApi.getIssuesByKeys(message.issueKeys).then((issues) => {
      message.issues = issues;
      return message;
    });
  }
  return Promise.resolve(message);
}

function computeInfoLevel(message) {
  const messageChunks = message.text ? message.text.split(' ') : [];

  message.needDetailedInfo |= messageChunks.length === message.issueKeys.length;

  return message;
}

function buildResponseMessage(message) {
  if (message.needDetailedInfo) {
    message.response = formatter.buildDetailedMessages(message.issues);
  } else {
    message.response = formatter.buildMessages(message.issues);
  }
  return message;
}

function sendResponseMessage(message) {
  if (message.response) {
    postMessage(message.room, null, {
      as_user: true,
      attachments: message.response,
      thread_ts: message.thread_ts,
    });
  }
}

function handleError(err, message) {
  bot.logger.error('hubot-jira-issue-fetcher:', err.stack);
  postMessage(message.room, formatter.buildErrorMessage(err.response.body), { as_user: true });
}

function postMessage(room, text, options) {
  bot.adapter.client.web.chat.postMessage(room, text, options);
}
