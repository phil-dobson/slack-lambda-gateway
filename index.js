// MIT License
//
// Copyright (c) 2017 Philip James Dobson
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
//     The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
//     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict";
var aws = require('aws-sdk');

const RESPONSE_HEADERS = { 'Content-Type': 'application/json' };

class LambdaFunction {
    constructor(functionName, region) {
        this.functionName = functionName;
        this.region = region;
    }

    toString(){
        return `${this.functionName}@${this.region}`;
    }
}

exports.handler = (event, context, callback) => {
    var lambdaFunction = null;
    try {
        lambdaFunction = extractLambdaFunction(event.path);

        var lambdaInvoker = new aws.Lambda({
            region: lambdaFunction.region
        });

        lambdaInvoker.invoke({
            FunctionName: lambdaFunction.functionName,
            InvocationType: 'Event',
            Payload: JSON.stringify(event)
        }, function (error, data) {
            if (error) {
                respondWithFailureToSlack(lambdaFunction, error, callback);
            }
            respondWithSuccessToSlack(lambdaFunction, callback);
        });
    } catch (error) {
        respondWithFailureToSlack(lambdaFunction, error, callback);
    }
};

function extractLambdaFunction(path) {
    if (path.startsWith("/")) {
        path = path.substring(1, path.length);
    }
    var constituents = path.split( '/' );
    if (constituents.length != 2) {
        throw new Error(`Invalid resource [${path}]. Expecting format [region/function-name]`);
    }
    return new LambdaFunction(constituents[1], constituents[0]);
}

function respondWithSuccessToSlack(lambdaFunction, callback) {
    callback(null, {
        statusCode: '200',
        body: `Lambda function ${lambdaFunction} has been started...`,
        headers: RESPONSE_HEADERS
    });
}

function respondWithFailureToSlack(lambdaFunction, error, callback) {
    callback(null, {
        statusCode: '500',
        body: `Lambda function ${lambdaFunction || ""} could not be started: ${error.message || error}`,
        headers: RESPONSE_HEADERS
    });
}