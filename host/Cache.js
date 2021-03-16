/**
 * @author Scott Lewis <scott@atomiclotus.net>
 * @copyright 2019 Scott Lewis
 * @version 1.0.0
 * @url http://github.com/iconifyit
 * @url https://atomiclotus.net
 *
 * PERMISSIONS
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *
 *   You are free to use, modify, and distribute this script as you see fit.
 *   No credit is required but would be greatly appreciated.
 *
 * NO WARRANTIES:
 *
 *   THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND.
 *   YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL
 *   THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF
 *   ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO
 *   NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.
 */

/**
 * Simple caching object.
 * @returns {{set: (function(*=, *=, *=): *), get: (function(*=): *)}}
 * @constructor
 */
var Cache = function() {

    var _cache = {};

    /**
     * Set a cache value.
     * @param   {string}    key
     * @param   {*}         data
     * @param   {boolean}   update
     * @private
     */
    function _set(key, data, update) {
        if (typeof(update) == 'undefined') update = false;
        if (_get(key) && ! update) return false;

        _cache[key] = data;
        return true;
    }

    /**
     * Boolean test if a cache object exists.
     * @param   {string} key
     * @returns {boolean}
     * @private
     */
    function _has(key) {
        return typeof(_get(key)) != 'undefined';
    }

    /**
     * Get a cached object.
     * @param   {string} key
     * @returns {*}
     * @private
     */
    function _get(key) {
        if (typeof(_cache[key]) == 'undefined') return undefined;
        return _cache[key];
    }

    return {
        /**
         * Public accessor to _get()
         * @param   {string}    key
         * @returns {*}
         */
        get: function(key) {
            return _get(key);
        },

        /**
         * Public accessor to _set()
         * @param   {string}    key
         * @param   {*}         data
         * @param   {boolean}   update
         * @returns {boolean}
         */
        set : function(key, data, update) {
            return _set(key, data, update);
        },

        /**
         * Public accessor to _has()
         * @param   {string}    key
         * @returns {boolean}
         */
        has : function(key) {
            return _has(key);
        }
    }
};
