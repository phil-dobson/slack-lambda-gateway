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
const RESPONSE_HEADERS = {'Content-Type': 'application/json'};

module.exports.respondWithSuccessToSlack = function (lambdaFunction, callback) {
    respondToSlack('200', `Lambda function ${lambdaFunction} has been started...`, callback);
};

module.exports.respondWithFailureToSlack = function (lambdaFunction, error, callback) {
    respondToSlack('500', `Lambda function ${lambdaFunction != null ? lambdaFunction + " " : ""}could not be started${error != null ? ": " + (error.message || error) : ' due to an unknown error'}`, callback);
};

function respondToSlack(statusCode, message, callback) {
    callback(null, {
        statusCode: statusCode,
        body: message,
        headers: RESPONSE_HEADERS
    });
}