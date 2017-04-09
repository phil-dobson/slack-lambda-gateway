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
const REGION = "REGION";
const FUNCTION_NAME = "FUNCTION_NAME";

const lambdaFunctionFactory = require("./lambdaFunctionFactory");
const assert = require("chai").assert;
const expect = require("chai").expect;

describe("Creates Lambda Functions", function () {

    describe("From a resource path", function () {
        [`${REGION}/${FUNCTION_NAME}`, `/${REGION}/${FUNCTION_NAME}`].forEach(function (resourcePath) {
            it(`Success for path ${resourcePath}`, function () {
                //when:
                let result = lambdaFunctionFactory.createFromPath(resourcePath);

                //then:
                assert.equal(result.region, REGION);
                assert.equal(result.functionName, FUNCTION_NAME);
            })
        });

        describe("Error scenarios", function () {
            it("Null resource", function () {
                //expect:
                expect(function () {
                    lambdaFunctionFactory.createFromPath(null)
                }).to.throw("resourcePath was null");
            });

            it("Undefined resource", function () {
                //setup:
                let undefined;

                //expect:
                expect(function () {
                    lambdaFunctionFactory.createFromPath(undefined)
                }).to.throw("resourcePath was null");
            });

            ["region", "region/functionName/more"].forEach(function (path) {
                it(`Invalid path ${path}`, function () {
                    //expect:
                    expect(function () {
                        lambdaFunctionFactory.createFromPath(path)
                    }).to.throw(`Invalid resource [${path}]. Expecting format [region/function-name]`);
                });
            });
        });
    });
});