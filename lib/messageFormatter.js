const _ = require('lodash');

let config;

module.exports = configuration => {
    config = configuration;

    return {
        buildDetailedMessages: issues => _.map(issues, buildDetailedMessage),
        buildMessages: issues => _.map(issues, buildMessage),
        buildErrorMessage: error => buildErrorMessage(error)
    };
};

function buildDetailedMessage(issue) {
    return {
        fallback: issue.fields.summary,
        color: getColorForStatus(issue.fields.status.name),
        author_name: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned',
        author_icon: issue.fields.assignee ? issue.fields.assignee.avatarUrls['16x16'] : null,
        title: `${issue.key}: ${issue.fields.summary}`,
        title_link: `https://${config.jiraHost}/browse/${issue.key}`,
        text: issue.fields.description,
        fields: [
            {
                title: 'Status',
                value: issue.fields.status.name
            }
        ]
    };
}

function buildMessage(issue) {
    return {
        fallback: issue.fields.summary,
        color: getColorForStatus(issue.fields.status.name),
        author_name: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned',
        author_icon: issue.fields.assignee ? issue.fields.assignee.avatarUrls['16x16'] : null,
        text: `<https://${config.jiraHost}/browse/${issue.key}|${issue.key}> \`${issue.fields.status.name}\` ${
            issue.fields.summary
        }`,
        mrkdwn_in: ['text']
    };
}

function getColorForStatus(status) {
    switch (status) {
        case 'In Development':
        case 'In Review':
        case 'Resolved':
            return '#00AEAF';
        case 'Incomplete':
            return 'warning';
        case 'Closed':
        case 'Deployed':
        case 'Declined':
            return 'good';
        case 'Error':
            return '#E53B30';
        default:
            return '#A0ACAF';
    }
}

function isUnknownKeyError(errorMessage) {
    return errorMessage && (errorMessage.indexOf('does not exist') !== -1 || errorMessage.indexOf('is invalid') !== -1);
}

function buildErrorMessage(error) {
    let message = 'Hmmm... something went wrong :thinking_face:',
        errorMessage = _.get(error, 'errorMessages[0]');

    if (isUnknownKeyError(errorMessage)) {
        const chunks = errorMessage.split("'");
        message = `:exclamation: \`${chunks[1]}\` cannot be found`;
    }

    return message;
}
