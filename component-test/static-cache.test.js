/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var Hippie4eyeos = require('eyeos-hippie');
var crypto = require("crypto");

var hippie4Eyeos = new Hippie4eyeos();
var basePath = "https://localhost/";


suite('component test', function () {

    var blob = crypto.randomBytes(10240);
    var testData = {
        blob: blob.toString('base64'),
        mimetype: "application/octet-stream",
        expiration: "10"
    };
    var cachedUrl;
    function postRequest (data) {
        return hippie4Eyeos.basicRequest(basePath)
            .form()
            .post("items")
            .send(data)
            .parser(function(body, fn) {
                fn(null, body);
            });
    }

    function getRequest(cachedUrl) {
        return hippie4Eyeos.basicRequest(basePath)
            .get(cachedUrl)
            .parser(function(body, fn) {
                fn(null, body);
            });
    }

    test("should return a status 200", function (done) {
        postRequest(testData)
            .expectStatus(200)
            .end(done);
    });

    test("should return a body with a data that contains a valid url and an id", function (done) {
        postRequest(testData)
            .expectBody(/^\/item\/\d+$/)
            .end(function(err, res, body) {
                if(err) {
                    return done(err);
                }
                cachedUrl = body;
                done();
            });
    });

    test("GETting the url returned should return the given mime type", function (done) {
        getRequest(cachedUrl)
            .expectHeader("Content-Type", testData.mimetype)
            .end(done);
    });

    test("GETting the url returned should return the given blob", function (done) {
        getRequest(cachedUrl)
            .expectBody(blob.toString('utf-8'))
            .end(done);
    });
});
