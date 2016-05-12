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

var logger = require('log2out')
    settings = require('../settings.js');

var instance;

var RedisDBFactory = function(host, port, logger, redisClient) {
    this.host = host || settings.persistence.host;
    this.port = port || settings.persistence.port;
    this.options = settings.persistence.options;
    this.logger = logger || log2out.getLogger('RedisDBFactory');
    this.redisClient = redisClient || require('redis');
};

RedisDBFactory.prototype = {
    cachedDb: false,

    getDB: function() {
        if (this.cachedDb) {
            return this.cachedDb;
        } else {
            var redisClient = this.redisClient.createClient(this.port, this.host, this.options);
            this.setDB(redisClient);
            return redisClient;
        }
    },

    setDB: function(db) {
        this.cachedDb = db;
    }

};

RedisDBFactory.getInstance = function () {
	if (!instance) {
		instance = new RedisDBFactory();
	}

	return instance;
};

module.exports = RedisDBFactory;
