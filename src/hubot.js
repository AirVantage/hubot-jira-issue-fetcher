import messageParser from './lib/messageParser';

const configuration = {
    host: process.env.JIRA_HOST,
    projectsKeys: process.env.JIRA_PROJECTS_KEYS.split(','),
    jiraUser: process.env.JIRA_USER,
    jiraPwd: process.env.JIRA_PWD,
};

function isDirectMessage(message, robot) {
    return message && message.indexOf(robot.name) !== -1;
}

export default (robot) => {
    const parser = messageParser(configuration);
    robot.listen(message => true, res => {
        const room = res.message.user.room,
            message = res.message.text,
            needDetailedInfo = isDirectMessage(message, robot);
        parser.parse(message, needDetailedInfo)
            .then(attachments => {
                if (attachments) {
                    robot.adapter.client.web.chat.postMessage(room, null, {
                        as_user: true,
                        attachments
                    });
                }
            })
            .catch(err => {
                robot.logger.error('hubot-jira-issue-fetcher:', err.response.body);
                robot.adapter.client.web.chat.postMessage(room, parser.anErrorOccured(err.response.body), {
                    as_user: true
                });
            });
    });
}
