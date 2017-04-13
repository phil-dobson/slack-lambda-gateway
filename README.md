# Slack-Lambda Gateway
[![Build Status](https://travis-ci.org/phil-dobson/slack-lambda-gateway.svg?branch=master)](https://travis-ci.org/phil-dobson/slack-lambda-gateway)
[![Coverage Status](https://coveralls.io/repos/github/phil-dobson/slack-lambda-gateway/badge.svg?branch=master)](https://coveralls.io/github/phil-dobson/slack-lambda-gateway?branch=master)

## Synopsis
A Node.js AWS Lambda function intended to be triggered by Slack Slash commands via an AWS API Gateway endpoint.

This gateway Lambda function asynchronously invokes a second Lambda function that can run for longer than Slack's 3000ms maximum response time.

## Usage
The function should be invoked by a Slack slash command. This should be set to make a HTTP request to an end point configured on AWS API Gateway.
The endpoint should have the path `region/foo-function`, e.g. `eu-west-1/hello-world`.
It also must have 'Lambda Proxy Integration' enabled.

## Deployment
The JS files must be zipped and deployed to AWS Lambda as a package.<br />
Unless you require modification, it is recommended that you download the latest release ZIP from GitHub.