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
const lambdaFunction = require("./lambdaFunction");

module.exports = {
    
    createFromPath(resourcePath) {
        if (resourcePath == null) {
            throw new Error("resourcePath was null");
        }
        if (resourcePath.startsWith("/")) {
            resourcePath = resourcePath.substring(1, resourcePath.length);
        }
        const constituents = resourcePath.split('/');
        if (constituents.length != 2) {
            throw new Error(`Invalid resource [${resourcePath}]. Expecting format [region/function-name]`);
        }
        return new lambdaFunction(constituents[1], constituents[0]);
    }
         
};