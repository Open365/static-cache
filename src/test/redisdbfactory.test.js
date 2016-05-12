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

var chai = require('chai');
    assert = chai.assert,
    sinon = require('sinon'),
    RedisDBFactory = require('../lib/memory/redisdbfactory.js'),
    FakeLogger = require('./utils/FakeLogger.js');
    redis = require('redis');


suite('RequestHandler Suite', function () {

    var sut;
    var redisClient;
    var redisClientMock;

    setup(function() {
        var fakeRedisClient = {
          'createClient': function(port, host) {
              return 'redisClient';
          }
        };
        this.redisClient = fakeRedisClient;
        this.sut = new RedisDBFactory('host', 'port', FakeLogger, this.redisClient);
    });

    suite('#getDB', function() {
        test('returns DB when already connected', function() {
            var expected = 'fakeDB';
            this.sut.setDB(expected);
            var actual = this.sut.getDB();
            assert.equal(actual, expected);
        });

        test('returns new DB when no connection available', function() {
            var actual = this.sut.getDB();
            assert.equal(actual, 'redisClient');
        });
    });
});
