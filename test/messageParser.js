import test from 'ava';
import messageParser from '../lib/messageParser';

const configuration = {
    jiraHost: 'issues.sierrawireless.com',
    projectsKeys: 'PLTFRS,PLTBUGS'.split(',')
};

const parser = messageParser(configuration);

test('parse simple key', t => {
    let message = parser.extractIssueKeys({
        text: 'Working on pltfrs-333. And PLTFRS-4567, PLTBUGS-3333! '
    });
    t.is(message.issueKeys.length, 3);
});


test('parse URLs', t => {
    let message = parser.extractIssueKeys({
        text: 'Working on https://issues.sierrawireless.com/browse/PLTBUGS-3333! '
    });
    t.is(message.issueKeys.length, 1);
});

test('only returns known issues', t => {
    let message = parser.extractIssueKeys({
        text: 'Working on PLTFRS-3456 and TOTO-25'
    });
    t.is(message.issueKeys.length, 1);
});

test('returns empty array when no issue found', t => {
    let message = parser.extractIssueKeys({
        text: 'Working TOTO-25'
    });
    t.is(message.issueKeys.length, 0);
});