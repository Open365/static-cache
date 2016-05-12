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
    RequestHandler = require('../lib/requesthandler.js'),
    PersistenceManager = require('../lib/memory/persistencemanager.js'),
    sinon = require('sinon'),
    settingsFake = require('./utils/settingsFake.js'),
    FakeLogger = require('./utils/FakeLogger.js');

suite('RequestHandler Suite', function () {

    var sut, req, res;
    var blob, mimetype, expiration, id;
	var persistenceManagerMock;
    var fakePersistenceManager;

    setup(function() {
        fakePersistenceManager = {
            get: function(id) {

            },
            store: function(blob, mimetype, expiration) {

            }
        };
        blob = 'a_test_blob';
        mimetype = 'image/png';
        expiration = '100';
        id = 'anId';
        req = prepareFakeRequest(blob, mimetype, expiration, id);
        res = prepareFakeResponse();
        this.persistenceManagerMock = sinon.mock(fakePersistenceManager);
        this.sut = new RequestHandler(fakePersistenceManager, FakeLogger);
    });

    suite('#setItem', function() {
        setup(function () {
            this.persistenceManagerMock = sinon.mock(fakePersistenceManager);
            this.sut = new RequestHandler(fakePersistenceManager, FakeLogger);
        });

        test('setItem when called calls persistenceManager store with correct values', function() {
            var aux = {
                'blob': blob,
                'mimetype': mimetype
            }
            var expectation = this.persistenceManagerMock.expects('store').once().withExactArgs(JSON.stringify(aux), expiration, sinon.match.func, sinon.match.func);
            this.sut.setItem(req, res);
            expectation.verify();
        });

        test('objectStoredCallback calls res.end with right params', function() {
            var fakeRedisId = 99;
            var fakeRes = prepareFakeResponse();
            var mock = sinon.mock(fakeRes);
            var expectation = mock.expects('end').once().withExactArgs('/item/' + fakeRedisId);
            this.sut.objectStoredCallback(fakeRedisId, fakeRes);
            expectation.verify();
        });
    });

    suite('#getItem', function() {
        setup(function() {
            persistenceManagerExpectataion = this.persistenceManagerMock.expects('get').once().withExactArgs(id, sinon.match.func, sinon.match.func);
        });

        test('should call persistencemanager with right params', function() {
            this.sut.getItem(req, res);
            persistenceManagerExpectataion.verify();
        });
    });

    suite('#objectStoredCallback', function() {
        setup(function() {
            data = '{"blob": "Y2FjYQ==", "mimetype": "aMimetype"}';
            var mock = sinon.mock(res);
            callbackExpectation = mock.expects('write').once().withExactArgs(sinon.match.object);
            callbackHeadExpectation = mock.expects('writeHead').once().withExactArgs(200, {'Content-Type': 'aMimetype'});

            callbackExpectationNoData = mock.expects('write').never();
            callbackHeadExpectationNoData = mock.expects('writeHead').once().withExactArgs(204);
        });

        test('calls res.write with right params', function() {
            this.sut.blobObtainedFromPersistenceCallback(res, data);
            callbackExpectation.verify();
        });

        test('calls res.writehead with right params', function() {
            this.sut.blobObtainedFromPersistenceCallback(res, data);
            callbackHeadExpectation.verify();
        });

        test('does not call res.write if no data', function() {
            this.sut.blobObtainedFromPersistenceCallback(res, undefined);
            callbackExpectationNoData.verify();
        });

        test('calls res.writehead if no data with right params', function() {
            this.sut.blobObtainedFromPersistenceCallback(res, undefined);
            callbackHeadExpectationNoData.verify();
        });
    });

    suite('#errorCallback', function() {
        setup(function() {
            var mock = sinon.mock(res);
            err = 'errorFromProvider';
            callbackExpectation = mock.expects('send').once().withExactArgs(err);
        });

        test('calls res send with right params', function() {
            this.sut.errorCallback(err, res);
            callbackExpectation.verify();
        });
    });

});

function prepareFakeRequest (blob, mimetype,expiration, id) {
	var req = {
		params: {
			blob: blob,
			mimetype: mimetype,
            expiration: expiration,
            id: id
		}
	};
	return req;
};

function prepareFakeResponse () {
	var res = {
		setHeader: function () {
		},
		end: function () {
		},
        send: function() {
        },
        write: function() {
        },
        writeHead: function() {
        }
	};
	return res;
}
