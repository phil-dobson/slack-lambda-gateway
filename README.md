# Slack-Lambda Gateway
[![Build Status](https://travis-ci.org/phil-dobson/slack-lambda-gateway.svg?branch=master)](https://travis-ci.org/phil-dobson/slack-lambda-gateway)

## Synopsis
A Node.js Lambda function intended to be triggered by Slack slash commands hitting AWS API Gateway endpoints.

The function asynchronously invoke a specified second function that can run for longer than Slack's 3000ms maximum response time.

## Usage
The function should be invoked by a Slack slash command. This should be set to make a HTTP request to an end point configured on AWS API Gateway.
The endpoint should have the path `region/foo-function`, e.g. `eu-west-1/hello-world`.
It also must have 'Lambda Proxy Integration' enabled.

## Deployment
This function must be zipped and deployed as a package.