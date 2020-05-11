const JiraApi = require('jira-client');

module.exports = function (config) {
  const jira = new JiraApi({
    protocol: 'https',
    host: config.jiraHost,
    username: config.jiraUser,
    password: config.jiraPwd,
    apiVersion: '2',
    strictSSL: true,
  });

  function getIssuesByKeys(keys) {
    return jira.searchJira(`key in (${keys.join(',')})`).then((res) => res.issues);
  }

  return {
    getIssuesByKeys: (keys) => getIssuesByKeys(keys),
  };
};
