import _ from 'lodash';

const ALL_JIRA_KEY_MATCHER = /[A-Z]*-\d+/g;

export default (configuration) => {
    return {
        extractIssueKeys: message => {
            let keys = message.text.toUpperCase().match(ALL_JIRA_KEY_MATCHER);
            keys = _.filter(keys, issueKey => _.includes(configuration.projectsKeys, issueKey.split('-')[0]));
            message.issueKeys = keys;

            return message;
        }
    };
};
