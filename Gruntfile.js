module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-release");

    grunt.initConfig({
        release: {
            options: {
                github: {
                    repo: "AirVantage/hubot-jira-issue-fetcher",
                    accessTokenVar: "GITHUB_ACCESS_TOKEN"
                }
            }
        }
    });
};
