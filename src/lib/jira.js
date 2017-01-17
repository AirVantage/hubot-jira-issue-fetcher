import got from 'got';

export default function(config) {
    const AUTH = new Buffer(config.jiraUser + ':' + config.jiraPwd).toString('base64');
    const jiraRestEndpoint = `https://${config.host}/rest`;


    function getIssue(params) {
        const getUrl = `${jiraRestEndpoint}/api/2/issue/${params.key}`;
        return got(getUrl, {
                json: true,
                headers: {
                    'Authorization': 'Basic ' + params.auth,
                    'user-agent': 'AirVantasge JIRA bot'
                }
            })
            .then(res => res.body);
    }

    function getIssuesByKeys(keys) {
        const searchUrl = `${jiraRestEndpoint}/api/2/search`;
        const searchQuery = {
            jql: `key in (${keys.join(',')})`
        };

        return got.post(searchUrl, {
                json: true,
                body: JSON.stringify(searchQuery),
                headers: {
                    'Authorization': `Basic ${AUTH}`,
                    'user-agent': 'AirVantage slack bot',
                    'Content-type': 'application/json'
                }
            })
            .then(res => res.body.issues);
    }

    return {
        getIssue: params => getIssue(params),
        getIssuesByKeys: keys => getIssuesByKeys(keys),
    };
};
