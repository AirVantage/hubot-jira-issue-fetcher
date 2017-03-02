import jira from './lib/jira';
import messageParser from './lib/messageParser';
import messageFormatter from './lib/messageFormatter';

const configuration = {
        jiraHost: process.env.JIRA_HOST,
        projectsKeys: process.env.JIRA_PROJECTS_KEYS.split(','),
        jiraUser: process.env.JIRA_USER,
        jiraPwd: process.env.JIRA_PWD
    },
    jiraApi = jira(configuration),
    parser = messageParser(configuration),
    formatter = messageFormatter(configuration),
    JIRA_KEY_MATCHER = /[A-Z]*-\d+/i;
let bot;

export default (robot) => {
    bot = robot;
    bot.hear(JIRA_KEY_MATCHER, res => {
        let message = {
            room: res.message.user.room,
            text: res.message.text,
            needDetailedInfo: isDirectMessage(res.message.text, robot)
        };

        getIssues(parser.extractIssueKeys(message))
            .then(computeInfoLevel)
            .then(buildResponseMessage)
            .then(sendResponseMessage)
            .catch(err => handleError(err, message));
    });
};

function isDirectMessage(message, robot) {
    return message && message.indexOf(robot.name) !== -1;
}

function getIssues(message) {
    message.issues = [];

    if (message.issueKeys.length) {
        return jiraApi.getIssuesByKeys(message.issueKeys)
            .then(issues => {
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
            // thread_ts: '1485810245.000003'
            // thread_ts: threadTs
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
