import _ from 'lodash';
import jira from './jira';
import issueMessageFormatter from './issueMessageFormatter';


export default (configuration) => {
    const config = configuration;
    const jiraApi = jira(config);
    const messageFormatter = issueMessageFormatter({
        config: config
    });
    let detailedInfo;
 
    function extractIssueKeys(message) {
        const messageChunks = message ? message.split(" ") : [];

        const keys = _.chain(messageChunks)
            .map(chunk => {
                return _.map(config.projectsKeys, projectKey => {
                    // Issue key detected
                    if (chunk.indexOf(`${projectKey}-`) === 0) {
                        return chunk
                    }

                    // Issue link => extract key
                    if (chunk.indexOf(projectKey) !== -1) {
                        return chunk.split(`https://${config.jiraHost}/browse/`)[1];
                    }
                });
            })
            .flatten()
            .compact()
            .value();

            detailedInfo = detailedInfo || (keys && messageChunks.length === keys.length);

            return keys;
    }

    function isUnknownKeyError(errorMessage) {
        return errorMessage &&
            (errorMessage.indexOf('does not exist') !== -1 || errorMessage.indexOf('is invalid') !== -1);
    }

    return {
        extractIssueKeys: message => extractIssueKeys(message),
        parse: (message, needDetailedInfo) => {
            detailedInfo = needDetailedInfo;
            const issueKeys = extractIssueKeys(message);

            if (issueKeys.length) {
                return jiraApi.getIssuesByKeys(issueKeys)
                    .then(issues => {
                        let messages;
                        if (detailedInfo) {
                            messages = messageFormatter.buildDetailedMessages(issues);
                        } else {
                            messages = messageFormatter.buildMessages(issues);
                        }
                        return messages;
                    });
            }

            return Promise.resolve();
        },
        anErrorOccured: error => {
            let message = 'Hmmm... something went wrong :thinking_face:',
                errorMessage = _.get(error, 'errorMessages[0]');

            if (isUnknownKeyError(errorMessage)) {
                const chunks = errorMessage.split('\'');
                message = `:exclamation: \`${chunks[1]}\` cannot be found`;
            }

            return message;
        }
    };
}
