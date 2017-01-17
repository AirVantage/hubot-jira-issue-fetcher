import _ from 'lodash';

export default (options) => {
    const config = options.config;

    function buildDetailedMessage(issue) {
        return {
            fallback: issue.fields.summary,
            color: getColorForStatus(issue.fields.status.name),
            author_name: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned',
            author_icon: issue.fields.assignee ? issue.fields.assignee.avatarUrls['16x16'] : null,
            title: `${issue.key}: ${issue.fields.summary}`,
            title_link: `https://${config.host}/browse/${issue.key}`,
            text: issue.fields.description,
            fields: [{
                title: 'Status',
                value: issue.fields.status.name,
            }]
        };
    }

    function buildMessage(issue) {

        return {
            fallback: issue.fields.summary,
            color: getColorForStatus(issue.fields.status.name),
            text: `<https://${config.host}/browse/${issue.key}|${issue.key}> \`${issue.fields.status.name}\` ${issue.fields.summary}`,
            mrkdwn_in: ['text']
        };
    }

    function getColorForStatus(status) {
        switch (status) {
            case 'In Progress':
            case 'Resolved':
                return '#00AEAF';
            case 'Incomplete':
                return 'warning';
            case 'Closed':
                return 'good'
            case 'Error':
                return '#E53B30';
            default:
                return '#A0ACAF';
        }
    }


    return {
        buildDetailedMessages: issues => _.map(issues, buildDetailedMessage),
        buildMessages: issues => _.map(issues, buildMessage),
        anErrorOccured: error => anErrorOccured(error)
    };
};
