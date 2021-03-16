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
 * Create a new logger instance.
 * @param name
 * @param folder
 * @constructor
 */
var Logger = function(name, folder) {

    /**
     * Enable or disable logging.
     * @type {boolean}
     */
    this.DEBUG = true ;

    /**
     * Default settings for the logger.
     * @type {{folder: string}}
     */
    this.defaults = {
        folder:  "~/Downloads/cep-boilerplate/logs"
    }

    /**
     * The log folder object.
     * @type {Folder}
     */
    this.folder = new Folder(folder || this.defaults.folder);

    /*
     * Create the log folder if it does not exist.
     */
    if (! this.folder.exists) {
        this.folder.create();
    }

    /**
     * The log file.
     * @type {File}
     */
    this.file = new File(
        this.folder.absoluteURI + "/" + name + "-" + this.dateFormat() + ".log"
    );

};

/**
 * Enable/disable logging.
 * @type {boolean}
 */
Logger.prototype.DEBUG = true;

/**
 * Logger prototype.
 * @type {{
 *     types: {
 *         INFO: string,
 *         WARN: string,
 *         ERROR: string
 *     },
 *     info: Logger.info,
 *     warn: Logger.warn,
 *     error: Logger.error,
 *     log: Logger.log,
 *     remove: Logger.remove,
 *     create: Logger.create
 * }}
 */
Logger.prototype = {

    /**
     * Log message types.
     */
    types: {
        INFO    : localize({en_US: "INFO"}),
        WARN    : localize({en_US: "WARN"}),
        ERROR   : localize({en_US: "ERROR"}),
        INSPECT : localize({en_US: "INSPECT"})
    },

    /**
     * Set debug value.
     * @param {boolean} value
     */
    setDebug: function(value) {
        this.DEBUG = value;
    },

    /**
     * Date string to prefix log entries.
     * @param date
     * @returns {string}
     */
    dateFormat: function() {
        var date = new Date().getTime();
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },

    /**
     * Add info message to log.
     * @param {string}  message     The string message
     * @param {object} vars         An optional object of key => value pairs to replace tokens in string
     */
    info : function(message, vars) {
        this.log(message, this.types.INFO, vars);
    },

    /**
     * Add warning message to log.
     * @param {string}  message     The string message
     * @param {object} vars         An optional object of key => value pairs to replace tokens in string
     */
    warn : function(message, vars) {
        this.log(message, this.types.WARN, vars);
    },

    /**
     * Add error message to log.
     * @param {string}  message     The string message
     * @param {object} vars         An optional object of key => value pairs to replace tokens in string
     */
    error : function(message, vars) {
        this.log(message, this.types.ERROR, vars);
    },

    /**
     * Add message to log.
     * @param {string}  message     The string message
     * @param {object} vars         An optional object of key => value pairs to replace tokens in string
     */
    log : function(message, type, vars) {
        if (! this.DEBUG) return;
        if (typeof(vars) == 'object') {
            message = this._t(message, vars);
        }
        this.write(
            this.file.absoluteURI,
            "[" + this.types[type] + "][" + new Date().toUTCString() + "] " + message
        );
    },

    /**
     * Delete log file.
     * @returns {*|Array}
     */
    remove : function() {
        if (this.file.exists) {
            return this.file.remove();
        }
    },

    /**
     * Create the log file.
     * @param message
     */
    create : function() {
        if (! this.file.exists) {
            return this.file.create();
        }
    },

    /**
     * Prints an object to the log.
     * @param obj
     */
    inspect: function(obj) {
        for (key in obj) {
            try {
                this.log(key + ' : ' + obj[key], this.types.INSPECT);
            }
            catch(e) {
                this.log(key + ' : [' + localize({en_US: 'Internal Error'}) + ']', this.types.INSPECT);
            }

        }
    },

    write: function(path, txt, replace, type) {
        if (typeof(type) == "undefined") {
            type = "TEXT";
        }
        try {
            var file = new File(path);
            if (replace && file.exists) {
                file.remove();
                file = new File(path);
            }
            file.open("e", type, "????");
            file.seek(0,2);
            $.os.search(/windows/i)  != -1 ? file.lineFeed = 'windows'  : file.lineFeed = 'macintosh';
            file.writeln(txt);
            file.close();
        }
        catch(ex) {
            try {
                file.close();
            }
            catch(ex) {
                throw ex.message;
            }
        }
        return true;
    },

    /**
     * Replace tokens in a string with key => value paired vars.
     * @param theText
     * @param theVars
     * @returns {*}
     * @private
     */
    _t : function(theText, theVars) {
        for (token in theVars) {
            theText = theText.replace(
                new RegExp("{" + token + "}","g"),
                theVars[token]
            );
        }
        return theText;
    },

    /**
     * Clear the log folder before writing new log files.
     * @param dirPath
     * @param pattern
     * @returns {string}
     */
    clear: function() {
        var count = 0;
        try {
            var files = this.folder.getFiles("*.log");
            files = files.concat(this.folder.getFiles("*.svg"));
            if (files.length) {
                for (var i=0; i<files.length; i++) {
                    (new File(files[i])).remove();
                    count++;
                }
            }
        }
        catch(e) {
            throw "Logger.rmdir() Error : " + e.message;
        }
        return count + " files were removed";
    }
};
