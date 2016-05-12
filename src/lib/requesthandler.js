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

var PersistenceManager = require('./memory/persistencemanager.js')
    logger = require('log2out'),
    settings = require('./settings.js');

var RequestHandler = function (persistenceManager, logger) {
    this.logger = logger || log2out.getLogger('RequestHandler');
	this.persistenceManager = persistenceManager || new PersistenceManager();
};

RequestHandler.prototype = {

	getItem: function (req, res) {
        var self = this;
        this.persistenceManager.get(req.params.id,
            function successCallback(blob) {
                self.blobObtainedFromPersistenceCallback(res, blob);
            },
            function errorCallback(err) {
                self.errorCallback(err, res);
            }
        );
	},

	setItem: function(req, res) {
        var params = {
            'blob': req.params.blob,
            'mimetype': req.params.mimetype
        };

        var self = this;
        this.persistenceManager.store(JSON.stringify(params), req.params.expiration,
            function successCallback(id) {
                self.objectStoredCallback(id, res);
            },
            function errorCallback(err) {
                self.errorCallback(err, res);
            }
        );
	},

    errorCallback:function(err, res) {
        this.logger.error('Error in persistence provider. Sending error response');
        res.send(err);
    },

    objectStoredCallback: function(id, res) {
        this.logger.debug('Persistence call successful, sending url to response');
        res.end('/item/' + id);
    },

    blobObtainedFromPersistenceCallback: function(res, reply) {
        try {
            if (reply) {
                var data = JSON.parse(reply);
                this.logger.debug('Response received.');
                res.writeHead(200, {
                    'Content-Type': data.mimetype
                });
                var b64string = data.blob;
                var buf = new Buffer(b64string, 'base64');
                res.write(buf);
            } else {
                this.logger.info('Item not found');
                res.writeHead(204);
            }
            res.end();
        } catch (error) {
            this.logger.error('Error getting blob from persistence: ', error)
        }

    }

};

module.exports = RequestHandler;
