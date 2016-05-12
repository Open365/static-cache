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

var sinon = require('sinon'),
	assert = require('chai').assert,
    PersistenceManager = require('../lib/memory/persistencemanager.js'),
    RedisProvider = require('../lib/memory/redisprovider.js');

suite('PersistenceManager Suite', function () {
	var sut;
    var value;
    var redisProvider;
    var redisMock;
    var expStore;
    var blob = 'a_test_blob';
    var mimetype = 'image/png';
    var expiration = 'exp';
    var id = 'anId';

	setup(function () {
        var fakeRedisClient = {};
        redisProvider = new RedisProvider('host', 'port', 'db', fakeRedisClient);
        sut = new PersistenceManager(redisProvider);
	});

    suite('#store', function() {
        setup(function() {
            redisMock = sinon.mock(redisProvider);
            value = {
                'blob': blob,
                'mimetype': mimetype
            };
            expStore = redisMock.expects('store').once().withExactArgs(value, expiration, fakeSuccesCallback, fakeErrorCallback);
        });

        test('store calls redisprovider store with right params', function() {
            sut.store(value, expiration, fakeSuccesCallback, fakeErrorCallback);
            expStore.verify();
        });
    });

    suite('#get', function() {
        setup(function() {
            redisMock = sinon.mock(redisProvider);
            providerCallExpectation = redisMock.expects('get').once().withExactArgs(id, fakeSuccesCallback, fakeErrorCallback);
        });

        test('calls provider get method with right params', function() {
            sut.get(id, fakeSuccesCallback, fakeErrorCallback);
            providerCallExpectation.verify();
        });
    });

    function fakeSuccesCallback() {};
    function fakeErrorCallback() {};

});
