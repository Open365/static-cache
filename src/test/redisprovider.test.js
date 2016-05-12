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
    assert = chai.assert;
    sinon = require('sinon');
    RedisProvider = require('../lib/memory/redisprovider.js'),
    redis = require('redis');


suite('RedisProvider Suite', function () {

    var sut;
    var redisClient;
    var redisClientMock;
    var redisClientSetExp;

    setup(function () {
        redisClient = {'set': function(){}, 'incr': function(){}, 'setex': function(){}};
        sut = new RedisProvider('host', 'port', 'db', redisClient);
    });

    suite('#store', function() {

        var key = 'i am a key';
        var value = 'i am the value';
        var expirationTime = '999';

        setup(function() {
            redisClientMock = sinon.mock(redisClient);
            redisClientSetExpectation = redisClientMock.expects('set').once().withExactArgs(key, value);

        });

        test('store calls redis module setex method with right params', function() {
            var redisStub = sinon.stub(redisClient, 'incr', function(id, callback) {
                callback(undefined,'id');// err is undefined
            });
            redisStoreStub = sinon.stub(redisClient, 'setex');
            sut.store(value, expirationTime, function(id) {});
            assert.isTrue(redisStoreStub.calledOnce);
        });

        test('store calls redis module incr method with right params', function() {
            redisClientIncrExpectation = redisClientMock.expects('incr').once().withExactArgs('nextitemid', sinon.match.func);
            sut.store(value, expirationTime);
            redisClientIncrExpectation.verify();
        });
    });

});
