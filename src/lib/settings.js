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

var Settings = {
    'port': process.env.EYEOS_STATICCACHE_PORT || 9909,
    'persistence': {
        'provider': process.env.EYEOS_STATICCACHE_PERSISTENCE_PROVIDER || 'redis',
        'host': process.env.EYEOS_STATICCACHE_PERSISTENCE_HOST || 'redis.service.consul',
        'port': process.env.EYEOS_STATICCACHE_PERSISTENCE_PORT || '6379',
        'db': process.env.EYEOS_STATICCACHE_PERSISTENCE_DB || 'static-cache',
        'options': {
            no_ready_check: process.env.EYEOS_STATICCACHE_PERSISTENCE_NO_READY_CHECK === 'true' || false
        }
    }
};

module.exports = Settings;
