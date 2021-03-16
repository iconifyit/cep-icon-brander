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
 * The base Progress class.
 * @constructor
 */
function Progress( options, show ) {

    this.top      = 0;
    this.left     = 0;
    this.width    = 450;
    this.height   = 100;

    this.minvalue = 0;
    this.maxvalue = 100;

    this.label    = "";

    this.window   = null;
    this.panel    = null;

    if ( typeof(options) != "undefined" ) {
        for (key in options) {
            if (this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
        this.init( this.minvalue, this.maxvalue, this.label );
    }

    if (show) this.show();
}

/**
 * Initialize start settings.
 * @param {integer} start
 * @param {integer} end
 */
Progress.prototype.init = function(start, end, theMessage) {

    var top    = 0,
        right  = 0,
        bottom = 0,
        left   = 0;

    this.minvalue = start;
    this.maxvalue = end;
    this.label    = theMessage;

    this.top      = 0;
    this.left     = 0;
    this.width    = 450;
    this.height   = 120;

    if ( bounds = getScreenSize() ) {
        left = Math.abs(Math.ceil((bounds.width/2) - (this.width/2)));
        top = Math.abs(Math.ceil((bounds.height/2) - (this.height/2)));
    }

    this.window = new Window(
        'palette',
        'Progress',
        [left, top, left + this.width, top + this.height]
    );

    this.window.pnl = this.window.add(
        'panel',
        [10, 10, 440, 100],
        'Progress'
    );

    this.window.pnl.progBar = this.window.pnl.add(
        'progressbar',
        [20, 45, 410, 60],
        0,
        this.maxvalue
    );

    this.window.pnl.progBarLabel = this.window.pnl.add(
        'statictext',
        [20, 20, 410, 35],
        "0 of " + this.maxvalue +
        (typeof(theMessage) != "undefined" ? " - " + theMessage : "" )
    );

    function getScreenSize() {
        var screen;

        for (i=0; i<$.screens.length; i++) {
            if ($.screens[i].primary == true) {
                screen = $.screens[i];
                screen.width = screen.right - screen.left;
                screen.height = screen.bottom - screen.top;
            }
        }
        return screen;
    }

    return this;
};

/**
 * Show the progress bar.
 */
Progress.prototype.show = function() {
    try { this.close(); } catch(e){};
    this.window.show();

    return this;
};

/**
 * Update the progress bar message & counter values.
 * @param {string} theMessage
 * @param {object} theVars      key => value pais of tokens to replace in theMessage
 */
Progress.prototype.update = function( theMessage, theVars ) {

    this.increment();

    this.text(
        this.value() + ' of ' + this.max() +
        (typeof(theMessage) != "undefined" ? " - " + theMessage : "" ),
        theVars
    );

    $.sleep(10);
    this.window.update();

    return this;
};

/**
 * String tokenizer function.
 * @param   {string}    theText
 * @param   {object}    theVars     key => value pais of tokens to replace in theMessage
 * @returns {string}
 * @private
 */
Progress.prototype._t = function(theText, theVars) {
    for (token in theVars) {
        theText = theText.replace(
            new RegExp("{" + token + "}","g"),
            theVars[token]
        );
    }
    return theText;
};

/**
 * Set or get the progress text.
 * @param   {string}    theText
 * @param   {object}    theVars     key => value pais of tokens to replace in theMessage
 * @returns {*}
 */
Progress.prototype.text = function( theText, theVars ) {
    if (typeof(theText) != "undefined") {
        this.window.pnl.progBarLabel.text = this._t(theText, theVars);
    }
    return this.window.pnl.progBarLabel.text;
};

/**
 * Set or get the progress current value.
 * @param   {integer}   theValue
 * @returns {*}
 */
Progress.prototype.value = function( theValue ) {
    if (typeof(theValue) != "undefined") {
        this.window.pnl.progBar.value = theValue;
    }
    return this.window.pnl.progBar.value;
};

/**
 * Get or set the minimum value.
 * @param {integer} theValue
 */
Progress.prototype.min = function( theValue ) {
    if (typeof(theValue) != "undefined") {
        this.window.pnl.progBar.minvalue = theValue;
    }
    this.window.pnl.progBar.minvalue;

    return this;
};

/**
 * Get or set the maximum value.
 * @param   {integer} theValue
 * @returns {number|integer|*}
 */
Progress.prototype.max = function( theValue ) {
    if (typeof(theValue) != "undefined") {
        this.window.pnl.progBar.maxvalue = theValue;
    }
    return this.window.pnl.progBar.maxvalue;
};

/**
 * Increment the counter value.
 * @returns {*}
 */
Progress.prototype.increment = function() {
    this.window.pnl.progBar.value++;
    return this.window.pnl.progBar.value;
};

/**
 * Close the progress bar.
 */
Progress.prototype.close = function() {
    this.window.close();
};
