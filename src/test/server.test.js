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
	Server = require('../lib/server.js'),
	assert = require('chai').assert,
	RouteManager = require('eyeos-route-manager'),
	settings = require('../lib/settings.js'),
	RequestHandler = require('../lib/requesthandler.js'),
    FakeLogger = require('./utils/FakeLogger.js'),
    RouteProvider = require('../lib/routeprovider.js');

suite('Server Suite', function () {
	var sut;
    var routeManager;
    var requestHandler;
    var routeManagerMock;
    var routeProvider;

	setup(function () {
        var fakePersistenceManager = {
          'store': function(blob, mimetype, expiration) {}
        };

        var fakeRoutes = [['get', '/item/:id'], ['post', '/items']];
		this.requestHandler = new RequestHandler(fakePersistenceManager);

		//fake restify
		restifyServer = {
			post: function () {
			},
			use: function () {
			},
			get: function () {
			},
			listen: function () {
			},
			on: function () {
			}
		};
		this.routeManager = new RouteManager(restifyServer);
        this.routeManagerMock = sinon.mock(this.routeManager);
        routeManagerStub = sinon.stub(routeManager);

        this.routeProvider = new RouteProvider();
		this.sut = new Server(this.requestHandler, restifyServer, this.routeManager, FakeLogger, fakeRoutes);
	});

	test('setRoutes calls server use', sinon.test(function () {
		var stub = this.stub(restifyServer, 'use');
		var stub2 = this.stub(requestHandler);
		this.sut.setRoutes();
		sinon.assert.calledWithExactly(stub, [sinon.match.func, sinon.match.func]);
	}));

	test('setRoutes calls server listen', sinon.test(function () {
		var stub = this.stub(restifyServer, 'listen');
		var stub2 = this.stub(requestHandler);
        this.sut.setRoutes();
		sinon.assert.calledWithExactly(stub, settings.port, sinon.match.func);
	}));

    test('setRoutes should call routeManager addRoute as many times as routes from routeProvider', function() {
        sinon.stub(this.routeProvider, 'getRoutes', function() {
            return ;
        });
        var expectation = this.routeManagerMock.expects('addRoute').twice();
        this.sut.setRoutes();
        expectation.verify();
    });

});
