// MIT License
//
// Copyright (c) 2017 Philip Dobson
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
const slackResponder = require("./slackResponder");
const LambdaFunction = require("./LambdaFunction");
const assert = require("chai").assert;
const expect = require("chai").expect;
const td = require("testdouble");

const LAMBDA_TO_STRING = "lambdaToString";
const ERROR_MESSAGE = "errorMessage";

const stubbedLambdaFunction = {
    toString: function () {
        return LAMBDA_TO_STRING;
    }
};

let callback;
describe("Responds back to Slack using the Lambda callback", function () {

    beforeEach(function () {
        callback = td.function();
    });

    it("Responds with success", function () {
        // when:
        slackResponder.respondWithSuccessToSlack(stubbedLambdaFunction, callback);

        // then:
        assertCallbackCalled(callback, "200", `Lambda function ${LAMBDA_TO_STRING} has been started...`);
    });

    [ERROR_MESSAGE, {message: ERROR_MESSAGE}].forEach(function (error) {
        it(`Responds with failure for error ${JSON.stringify(error)}`, function () {
            // when:
            slackResponder.respondWithFailureToSlack(stubbedLambdaFunction, error, callback);

            // then:
            assertCallbackCalled(callback, "500", `Lambda function ${LAMBDA_TO_STRING} could not be started: ${ERROR_MESSAGE}`);
        });
    });

    it(`Responds with failure for null error`, function () {
        // when:
        slackResponder.respondWithFailureToSlack(stubbedLambdaFunction, null, callback);

        // then:
        assertCallbackCalled(callback, "500", `Lambda function ${LAMBDA_TO_STRING} could not be started due to an unknown error`);
    });

    afterEach(function () {
        td.reset();
    });
});

function assertCallbackCalled(callback, statusCode, message) {
    let callbackExplanation = td.explain(callback);
    assert.equal(callbackExplanation.callCount, 1, "callback was not called");

    var args = callbackExplanation.calls[0].args;

    var error = args[0];
    assert.equal(error, null);

    var data = args[1];
    assert.equal(data.statusCode, statusCode);
    assert.equal(data.body, message);
    expect(data.headers).to.deep.equal({'Content-Type': 'application/json'});
}