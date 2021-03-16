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
 * Creates a new Configuration option with the values from options.
 * @param {Object} Options
 * @constructor
 */
var Configuration = function(Options) {

    this.values = {};

    /**
     * Get a value from an object or array.
     * @param   {object|array}    subject
     * @param   {string}          key
     * @param   {*}               dfault
     * @returns {*}
     */
    this.get = function(key, dfault) {
        var value = dfault;
        if (typeof(this.values[key]) != 'unedfined') {
            value = this.values[key];
        }
        return value;
    };

    /**
     * Get a value from an object or array.
     * @param   {object|array}    subject
     * @param   {string}          key
     * @param   {*}               dfault
     * @returns {*}
     */
    this.set = function(key, value) {
        this.values[key] = value;
    };

    /**
     * Extends {Object} target with properties from {Object} source.
     * @param target
     * @param source
     */
    this.extend = function(source) {
        for (var key in source) {
            // if (this.get(key, false)) {
            //     continue;
            // }
            this.values[key] = source[key];
        }
    };

    /**
     * Updates {Object} target with properties from {Object} source.
     * Any previously set values will be over-written.
     * @param {Object}  source      The source object with new values.
     * @param {Boolean} overwrite   Whether or not new values should replace old values.
     */
    this.update = function(source, overwrite) {
        if (typeof(overwrite) == undefined) {
            overwrite = true;
        }
        for (var key in source) {
            if (typeof(this.values[key]) != 'unedfined') {
                if (! overwrite && this.get(key, false)) {
                    continue;
                }
                this.values[key] = source[key];
            }
        }
    };

    this.extend(Options);
};
