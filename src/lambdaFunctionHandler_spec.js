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
const REGION = "region";
const FUNCTION_NAME = "functionName";
const PATH = "path";
const event = {path: PATH};
const ERROR = new Error("test");

const td = require("../node_modules/testdouble");
const assert = require("../node_modules/chai").assert;

let mockLambdaFunctionFactory;
let mockSlackResponder;

let unit;

const throwError = function() {
    throw ERROR;
};

const mockLambdaFunction = td.object({functionName: FUNCTION_NAME, region: REGION});
const MockAwslambdaConstructor = td.constructor(["invoke"]);

const context = td.object();
const callback = td.function();

describe("Lambda Function Handler", function () {
    beforeEach(function() {
        mockLambdaFunctionFactory = td.replace("./lambdaFunctionFactory");
        mockSlackResponder = td.replace("./slackResponder");
    });

    describe("No internal errors", function() {
        beforeEach(function() {
            td.replace("../node_modules/aws-sdk", {Lambda: MockAwslambdaConstructor});
            unit = require("./lambdaFunctionHandler");
            td.when(mockLambdaFunctionFactory.createFromPath(PATH)).thenReturn(mockLambdaFunction);
        });

        it("Happy path", function () {
            //when:
            unit(event, context, callback);

            //then:
            const invokeExplanation = td.explain(MockAwslambdaConstructor.prototype.invoke);
            assert.equal(invokeExplanation.callCount, 1);
            const invokeArgs = invokeExplanation.calls[0].args;
            const options = invokeArgs[0];
            assert.equal(options.FunctionName, FUNCTION_NAME);
            assert.equal(options.InvocationType, 'Event');
            assert.equal(options.Payload, JSON.stringify(event));
            const invokeCallback = invokeArgs[1];

            //callback:
            invokeCallback(null, null);

            //then:
            td.verify(mockSlackResponder.respondWithSuccessToSlack(mockLambdaFunction, callback));
        });

        it("Failed remote Lambda invocation", function () {
            //when:
            unit(event, context, callback);

            //then:
            const invokeExplanation = td.explain(MockAwslambdaConstructor.prototype.invoke);
            assert.equal(invokeExplanation.callCount, 1);
            const invokeCallback = invokeExplanation.calls[0].args[1];

            //callback:
            invokeCallback(ERROR, null);

            //then:
            td.verify(mockSlackResponder.respondWithFailureToSlack(mockLambdaFunction, ERROR, callback));
        });
    });

    describe("Internal error scenarios", function () {
        it("Failure creating Lambda Function", function () {
            //setup:
            unit = require("./lambdaFunctionHandler");
            td.when(mockLambdaFunctionFactory.createFromPath(PATH)).thenThrow(ERROR);

            //when:
            unit(event, context, callback);

            //then:
            td.verify(mockSlackResponder.respondWithFailureToSlack(undefined, ERROR, callback));
        });

        it("Failure creating Lambda Invoker", function () {
            //setup:
            td.replace("../node_modules/aws-sdk", {Lambda: throwError});
            unit = require("./lambdaFunctionHandler");

            td.when(mockLambdaFunctionFactory.createFromPath(PATH)).thenReturn(mockLambdaFunction);

            //when:
            unit(event, context, callback);

            //then:
            td.verify(mockSlackResponder.respondWithFailureToSlack(mockLambdaFunction, ERROR, callback));
        });

        it("Failure invoking Lambda Invoker", function () {
            //setup:
            td.replace("../node_modules/aws-sdk", {Lambda: MockAwslambdaConstructor});
            unit = require("./lambdaFunctionHandler");

            td.when(mockLambdaFunctionFactory.createFromPath(PATH)).thenReturn(mockLambdaFunction);
            td.when(MockAwslambdaConstructor.prototype.invoke(td.matchers.anything(), td.matchers.anything())).thenThrow(ERROR);

            //when:
            unit(event, context, callback);

            //then:
            td.verify(mockSlackResponder.respondWithFailureToSlack(mockLambdaFunction, ERROR, callback));
        });
    });

    afterEach(function () {
        td.reset();
    });
});