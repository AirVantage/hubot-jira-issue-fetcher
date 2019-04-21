# hubot-jira-issue-fetcher

> Hubot script that detects JIRA issue keys in messages, fetch corresponding details and display them

[![Build Status](https://travis-ci.org/AirVantage/hubot-jira-issue-fetcher.svg?branch=master)](https://travis-ci.org/AirVantage/hubot-jira-issue-fetcher)

## Usage

Requires the following environment variables to be set:

-   `JIRA_HOST`
    -   e.g: `issues.sierrawireless.com`
-   `JIRA_PROJECTS_KEYS`
    -   e.g: `PLTFRS,OPE`
-   `JIRA_USER`
-   `JIRA_PWD`

## Features

### Light display

When invited in a channel, hubot detects JIRA issue keys, fetch corresponding details and display a minimal version of the details:

-   Key (link)
-   Status
-   Summary

### Detailed display

When talking directly to or mentioning hubot in message channel, will result in hubot providing more information regarding the issue(s):

-   Assignee (name + avatar)
-   Key + Summary (link)
-   Description
-   Status

## Development

See https://github.com/AirVantage/ccbot#development-setup
