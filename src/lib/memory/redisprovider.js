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

var logger = require('log2out'),
    RedisDBFactory = require('../memory/redisdbfactory.js');

var RedisProvider = function (host, port, db, redisClient, logger) {
    this.logger = logger || log2out.getLogger('RedisProvider');
    this.redis = redisClient || RedisDBFactory.getInstance().getDB();
};

RedisProvider.prototype = {

    get: function(id, successCallback, errorCallback) {
        this.redis.get("static:" + id, function (err, reply) {
            if (err) {
                self.logger.error('Error getting element with id ' + id + '. Err=' + err);
                errorCallback(err);
            }
            successCallback(reply);
        });
    },

    store: function(value, expiration, successCallback, errorCallback) {
        var self = this;
        this.redis.incr('nextitemid', function(err, id) { // we increase the id index before inserting
            if (err) {
                self.logger.error('Error persisting value ' + value + ' for ' + id + '. Err=' + err);
                errorCallback(err);
            } else {
                self.redis.setex('static'  + ':' + id, expiration, value, function(err) {
                    if (err) {
                        self.logger.error('Error persisting value ' + value + ' for ' + id + '. Err=' + err);
                        errorCallback(err);
                    } else {
                        successCallback(id);
                    }
                });
            }
        });
    }
};

module.exports = RedisProvider;
