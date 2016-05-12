#!/usr/bin/env node
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

var restify = require('restify');
	settings = require('./settings.js');
    RequestHandler = require('./requesthandler.js')
    RouteManager = require('eyeos-route-manager'),
    RouteProvider = require('./routeprovider.js'),
    log2out = require('log2out');

function Server (requestHandler, restifyServer, routeManager, logger, routes) {
    this.requestHandler = requestHandler || new RequestHandler();
    this.server = restifyServer || restify.createServer();
    this.routeManager = routeManager || new RouteManager(this.server);
    this.logger = logger || log2out.getLogger('Server');
    this.routes = routes || (new RouteProvider()).getRoutes();
}

Server.prototype = {
	setRoutes: function () {
		this.server.use(restify.bodyParser({ mapParams: true })) ;

        for (var i = 0; i < this.routes.length; i++) {
            this.routeManager.addRoute(this.routes[i][0], this.routes[i][1], this.requestHandler[this.routes[i][2]], this.requestHandler);
        };

		this.server.on('uncaughtException', function restify_onUncaughtException(req, res, route, error) {
			this.logger.error(this.logName,
				"Exception on route", route,
				'; ERROR:', error,
				'; STACK:', error.stack
			);
			res.send("There was an internal error. Try in a few moments or contact an administrator if the problem persists");
		});

        var self = this;

		this.server.listen(settings.port, function () {
			self.logger.debug('Listening at ' + settings.port);
		});
	}
};

module.exports = Server;
