import test from 'ava';
import jiraService from '../lib/jira';

const configuration = {
    jiraHost: process.env.JIRA_HOST,
    projectsKeys: process.env.JIRA_PROJECTS_KEYS.split(','),
    jiraUser: process.env.JIRA_USER,
    jiraPwd: process.env.JIRA_PWD,
};
const jira = jiraService(configuration);

test('get issues by keys', async t => {
    const issues = await jira.getIssuesByKeys(['PLTFRS-5852', 'PLTBUGS-6569']);
    t.truthy(issues, 'Must have found issues');
});
