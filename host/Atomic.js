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
 * A global core object to normalize methods on both Client and Host.
 * @type {{include, scope}}
 */
var Atomic = (function(interface) {

    console.log(typeof(interface.os));
    console.log(interface);

    function _getScope() {
        return typeof(interface.os) == 'undefined' ? 'CLIENT' : 'HOST';
    }

    /**
     * Load an external script file in the client.
     * @param url
     * @param callback
     * @private
     */
    function _loadScript(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.head;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

    /**
     * Wrapper for CEP's evalFile.
     * @param theFilePath
     * @returns {*}
     */
    function _include(theFilePath) {
        if (_getScope() == 'CLIENT') {
            _loadScript(theFilePath);
        }
        else {
            if ((new File(theFilePath)).exists) {
                $.evalFile( theFilePath );
            }
        }
    }

    return {
        scope : _getScope(),

        /**
         * Include an external script file on Client or Host side.
         * @param   {string}    theFilePath
         * @returns {void}
         */
        include : function(theFilePath) {
            _include(theFilePath);
        }
    }

})(CSInterface || $);
