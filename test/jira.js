import test from 'ava';
import jira from '../lib/lib/jira';

test('get issues by keys', async t => {
    const issues = await jira.getIssuesByKeys(['PLTFRS-5852', 'PLTBUGS-6569']);
    t.truthy(issues, 'Must have found issues');
});
