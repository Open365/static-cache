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

var chai = require('chai'),
    assert = chai.assert,
    sinon = require('sinon')
    RouteProvider = require('../lib/routeprovider.js');

suite('RouteProvider Suite', function () {

    var sut;
    var routeManager;

    setup(function () {
        this.routeManager = new RouteManager();
        sut = new RouteProvider();
    });

    test('getRoutes should return a routes array', function() {
        var expected = [
            ['get', '/item/:id', 'getItem'],
            ['post', '/items', 'setItem']
        ];
        var actual = sut.getRoutes();
        assert.deepEqual(actual, expected);
    });

});
