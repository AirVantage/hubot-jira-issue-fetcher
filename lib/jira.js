const JiraClient = require('jira-client');

module.exports = function (config) {
  const jiraClient = new JiraClient({
    protocol: 'https',
    host: config.JIRA_API_HOST,
    bearer: config.JIRA_TOKEN,
    apiVersion: '2',
    strictSSL: true,
  });

  return {
    getIssuesByKeys: (keys) => jiraClient.searchJira(`key in (${keys.join(',')})`).then((res) => res.issues),
  };
};
