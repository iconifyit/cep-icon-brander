/**
 * @author    Scott Lewis <scott@atomiclotus.net>
 * @copyright 2018 Astute Graphics
 * @version   1.0.0
 * @url       https://astutegraphics.com
 * @url       https://atomiclotus.net
 *
 * ABOUT:
 *
 *    Helper functions for general use.
 *
 * CREDITS:
 *
 *   This extension is based on the CEP Boilerplate extension by Scott Lewis
 *   at Atomic Lotus, LLC.
 *
 * NO WARRANTIES:
 *
 *   You are free to use, modify, and distribute this script as you see fit.
 *   No credit is required but would be greatly appreciated.
 *
 *   THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND.
 *   YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL
 *   THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF
 *   ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO
 *   NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.
 */

/**
 * Test if this class supports the Ai Object type. Before you can use
 * this method, define an array in the global scope named `supportedTypes`.
 * The underscore indicates the array is meant to be private.
 * @param   {string}    theType
 * @returns {boolean}
 * @private
 */
function isSupported(theType) {
    if (typeof(supportedTypes) == 'undefined') {
        throw "You must create a global array named `supportedTypes` with the supported type names";
    }
    return supportedTypes.indexOf(theType.toLowerCase()) >= 0;
}

/**
 * Check the type of an object.
 * @param   {*}         theItem
 * @param   {string}    theType
 * @returns {boolean}
 * @private
 */
function isType(theItem, theType) {
    return strcmp(typeof(theItem), theType);
}

/**
 * Check the typename of an AI Object.
 * @param   {*}         theItem
 * @param   {string}    theTypename
 * @returns {boolean}
 * @private
 */
function isTypename(theItem, theTypename) {
    if (strcmp(theItem.typename, 'undefined')) return false;
    return strcmp(theItem.typename, theTypename);
}

/**
 * Get the typename of an object if it is set.
 * @param   {object}    theItem
 * @returns {string|null}
 */
function getTypename(theItem) {
    if (isDefined(theItem.typename)) return theItem.typename;
    return "undefined";
}

/**
 * Is theItem an object?
 * @param   {*} theItem
 * @returns {*}
 * @private
 */
function isObject(theItem) {
    return isType(theItem, 'object');
}

/**
 * Is theItem a function?
 * @param   {*}         theItem
 * @returns {boolean}
 * @private
 */
function isFunction(theItem) {
    return isType(theItem, 'function');
}

/**
 * Is theItem a string?
 * @param   {*}         theItem
 * @returns {boolean}
 */
function isString(theItem) {
    return isType(theItem, 'string');
}

/**
 * Is theItem a number?
 * @param   {*}         theItem
 * @returns {boolean}
 */
function isNumber(theItem) {
    return ! isNaN(theItem);
}

function isNonEmptyString(theItem) {
    return isDefined(theItem) && isString(theItem) && ! isEmpty(theItem);
}

/**
 * Determine if a value is true-ish.
 * USE ONLY with strings, ints, and booleans.
 * @param   {string|boolean|integer} what
 * @returns {boolean}
 */
function isTrue(what) {

    if (what === true) return true;

    if (isString(what)) {
        var variants = [
            'yes', 'oui', 'ja', 'da',
            'si', 'yeah', 'yep', 'yup',
            'you know it', 'of course'
        ];
        what = what.toLowerCase();
        if (what === "true")     return true;
        if (variants.indexOf(what) != -1) return true;
    }

    if (! isNaN(what)) {
        if (parseInt(what) > 0) return true;
    }

    return false;
}

/**
 * Determine if a value is false-ish.
 * USE ONLY with strings, ints, and booleans.
 * @param   {string|boolean|integer} what
 * @returns {boolean}
 */
function isFalse(what) {

    if (what === false) return true;

    if (isString(what)) {
        var variants = [
            'no', 'non', 'nein', 'nyet',
            'nope', 'nah', 'not a chance', 'nay',
            'fuck no', 'false', 'no way', '0'
        ];
        what = what.toLowerCase();
        if (variants.indexOf(what) != -1) return true;
    }

    if (! isNaN(what)) {
        if (parseInt(what) === 0) return true;
    }

    return false;
}

/**
 * Is theString an error (Starts with the word 'Error')?
 * @param   {string}    theString
 * @returns {boolean}
 */
function isErrorString(theString) {
    if ( theString.substr(0, 5).toLowerCase() == 'error' ) {
        return true;
    }
    if ( theString.toLowerCase().indexOf('typeerror') != -1) {
        return true;
    }
    return false;
}

/**
 * Is theItem a GroupItem?
 * @param   {*}         theItem
 * @returns {boolean}
 * @private
 */
function isGroupItem(theItem) {
    return isTypename(theItem, 'GroupItem');
}

/**
 * Is theItem a PathItem?
 * @param   {*}         theItem
 * @returns {boolean}
 * @private
 */
function isPathItem(theItem) {
    return isTypename(theItem, 'PathItem');
}

/**
 * Is theItem a CompoundPathItem?
 * @param   {GroupItem} theItem
 * @returns {boolean}
 * @private
 */
function isCompoundPathItem(theItem) {
    return isTypename(theItem, 'CompoundPathItem');
}

/**
 * Test if a value is defined.
 * @param   {string}    property
 * @returns {boolean}
 * @private
 */
function isDefined(theItem) {
    return typeof(theItem) != 'undefined';
}

/**
 * If theItem is defined, return it, otherwise set it to theDefault value.
 * @param   {*}     theItem
 * @param   {*)     theDefault
 * @returns {boolean|*}
 */
function isDefinedOr(theItem, theDefault) {
    if (typeof(theItem) != 'undefined') {
        return theItem;
    }
    return theDefault;
}

/**
 * If theItem is not empty, return it, otherwise set it to theDefault value.
 * @param   {*}     theItem
 * @param   {*)     theDefault
 * @returns {boolean|*}
 */
function isEmptyOr(theItem, theDefault) {
    if (! isEmpty(theItem)) {
        return theItem;
    }
    return theDefault;
}

/**
 * Test if two strings are equal.
 * @param   {string}    theItem
 * @param   {string}    matchCase
 * @returns {boolean}
 */
function areEqual(a, b, matchCase) {
    if (! matchCase) {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }
    return a === b;
}

/**
 * Get the current timestamp.
 * @returns {number}
 * @private
 */
function now() {
    return (new Date()).getTime();
}

/**
 * Ensures a Path ends with a trailing slash.
 * @param   {string}    path
 * @returns {string}
 */
function slash(path) {
    if (path.charAt(path.length-1) != '/') {
        path += '/';
    }
    return path;
};

/**
 * Appends a string to a base string using a divider.
 * @param   {string} base
 * @param   {string} add
 * @param   {string} divider
 * @returns {string}
 */
function pack(base, add, divider) {
    if (base.charAt(base.length-1) != divider) {
        base += divider;
    }
    return base + add;
}

/**
 * Trap function execution in a try/catch block.
 * @param   {function}    func
 * @returns {*}
 */
function trap(func, customError) {
    try {
        return func();
    }
    catch(e) {
        return customError || e.message ;
    }
}

/**
 * Format date into a filename-friendly format.
 * @param   {string}  date
 * @returns {string} "YYYY-MM-DD"
 */
function dateFormat(date, separator) {
    if (! isDefined(separator)) {
        separator = "-";
    }
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day   = '' + d.getDate(),
        year  = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join(separator);
}

/**
 * Test of a variable is completely empty.
 * @param   {*}         data
 * @returns {boolean}
 */
function isEmpty(data) {
    if (typeof(data) == 'number' || typeof(data) == 'boolean') {
        return false;
    }
    if (typeof(data) == 'undefined' || data === null) {
        return true;
    }
    if (typeof(data.length) != 'undefined') {
        return data.length == 0;
    }
    var count = 0;
    for (var i in data) {
        if (data.hasOwnProperty(i)) count ++;
    }
    return count == 0;
}

/**
 * Convert XML document to string.
 * @param   {XmlDocument} xmlData
 * @returns {string}
 */
function xmlToString(xmlData) {
    //IE
    if (window.ActiveXObject){
        return xmlData.xml;
    }
    // Everyone else.
    return (new XMLSerializer()).serializeToString(xmlData);
}

/**
 * Trim newline chars from a long string.
 * @param   {string}    theText
 * @returns {string}
 */
function trimNewLines(theText) {
    return theText.replace(/\r?\n/g, "");
}

/**
 * Setting the active artboard and getting a reference to it are commonly called
 * together so why not do both in  one step?
 * @param   {integer}   idx
 * @returns {Artboard}
 */
function setActiveArtboard(idx) {
    try {
        var doc = app.activeDocument;
        doc.artboards.setActiveArtboardIndex(idx);
        return doc.artboards[doc.artboards.getActiveArtboardIndex()];
    }
    catch(e) {
        console.log(e);
    }
}

/**
 * Get a specific artboard by its name.
 * @param theName
 * @returns {*}
 */
function getArtboardIndex(theName) {
    try {
        if (app.documents.length == 0) {
            return -1;
        }

        var doc = app.activeDocument;
        var artboards = doc.artboards;

        for ( i = 0; i < artboards.length; i++ ) {
            Host.logger.info(
                'Artboard {name} has index {idx}{mark}', {
                name : artboards[i].name,
                idx  : i,
                mark : artboards[i].name == theName ? ' *' : ''
            });
            if ( artboards[i].name == theName ) {
                return i;
            }
        }

        return -1;
    }
    catch(e) {
        Host.logger.error('getArtboardIndex Error : {error}', {error : e});
        return -1;
    }
}

/**
 * Copies the current selection to the specified artboard and position.
 * @param artboardIndex
 * @param position
 */
function copySelectionToArtboard(artboardIndex, position) {

    // Copy the current selection.

    app.executeMenuCommand('copy');
    doc.selection = null;

    // Activate the target artboard.

    doc.artboards.setActiveArtboardIndex(artboardIndex);
    doc.artboards[doc.artboards.getActiveArtboardIndex()].rulerOrigin = [0, 0];

    // Paste the copied object.

    app.executeMenuCommand('pasteFront');

    // Set the copied object's position.

    var theCopiedItem = doc.selection[0];

    theCopiedItem.position = position;

    // Return a reference to the new object.

    return theCopiedItem;
}

/**
 * Deselect everything.
 */
function deselectAll() {
    try {
        app.executeMenuCommand("deselect");
    } catch(e) {}
}

/**
 * Decrease a number by a given amount.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function minus(a, b) {
    return a <= 0 ? a + b : a - b ;
}

/**
 * Creates a new RGB Color.
 * @param r
 * @param g
 * @param b
 * @returns {RGBColor}
 * @constructor
 */
var RGB = function(r,g,b){
    var c = new RGBColor();
    c.red   = r;
    c.green = g;
    c.blue  = b;
    return c;
};

/**
 * Convert HEX color to RGB.
 * @param hex
 * @returns {*}
 */
function hexToRgb(hex) {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Create a new CMYK color.
 * @param c
 * @param m
 * @param y
 * @param k
 * @returns {CMYKColor}
 * @constructor
 */
var CMYK = function(c,m,y,k) {
    var ink = new CMYKColor();
    ink.cyan   = c;
    ink.magenta = m;
    ink.yellow  = y;
    ink.black  = k;
    return ink;
};

/**
 * Draws diagonal line from lower left to upper right.
 * @param   {PathItems[]} paths
 * @param   {Number}      left
 * @param   {Number}      right
 * @param   {Number}      top
 * @param   {Number}      bottom
 * @returns {PathItem}
 * @constructor
 */
function Diagonal(paths, options) {

    var properties = {
        start       : [0, 0],
        end         : [100, 100],
        color       : new RGB(128, 128, 128),
        strokeWidth : 1,
        stroked     : true,
        filled      : false
    };

    for (key in options) {
        properties[key] = options[key];
    }

    path = paths.add();
    path.setEntirePath([properties.start, properties.end]);
    path.stroked     = properties.stroked;
    path.strokeColor = properties.color;
    path.strokeWidth = properties.strokeWidth;

    return path;
}

/**
 * Creates a new rectangle
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns {Array}
 * @constructor
 */
var Rectangle = function(x, y, width, height) {
    var l = 0;
    var t = 1;
    var r = 2;
    var b = 3;

    var rect = [];

    rect[l] = x;
    rect[t] = -y;
    rect[r] = width + x;
    rect[b] = -(height - rect[t]);

    return rect;
};

/**
 * Add leading zeroes to an integer.
 * @param   {int} num      The number to which to add leading zeros.
 * @param   {ing} zeros    The length of the resulting string.
 * @returns {str}
 */
function addLeadingZeros(num, width) {
    return String(Math.pow(10, width) + num).slice(-width) ;
}

/**
 * Case-insensitive string comparison.
 * @param aText
 * @param bText
 * @returns {boolean}
 */
function strcmp(aText, bText) {
    return aText.toLowerCase() == bText.toLowerCase();
}

/**
 * Repeat a string for length.
 * @param str
 * @param len
 * @returns {string}
 */
function repeat(str, len) {
    // return (String(Math.pow(10, len)).substring(1,len+1)).replace(/0/g, str);
    var tmp = "";
    for (var i = 0; i <= len; i++ ) {
        tmp += str;
    }
    return tmp;
}

/**
 * Use scaling to account for floating point math issues in JavaScript.
 * @param num
 * @returns {number}
 */
function round(num) {
    return Math.round((num + 0.00001) * 100) / 100 ;
}

/**
 * Represent a number as a fixed decimal float.
 * @param n
 * @param len
 * @returns {string}
 */
function toFixed(n, len) {
    if (String(n).indexOf('.') == -1) {
        return n + '.' + repeat('0', len);
    }
    var str  = String(n);
    var bits = str.split('.');
    var num  = bits.shift();
    var dec  = bits.pop();
    dec  = dec.slice(0, len);

    if (dec.length < len) {
        dec = dec + repeat('0', len - dec.length);
    }
    return String(num + '.' + dec);
}

/**
 * Replace tokens in a string with key => value paired vars.
 * @param theText
 * @param theVars
 * @returns {*}
 * @private
 */
function _t(theText, theVars) {
    for (token in theVars) {
        theText = theText.replace(
            new RegExp("{" + token + "}","g"),
            theVars[token]
        );
    }
    return theText;
}

/**
 * Alias of _t()
 * @param theText
 * @param theVars
 * @returns {*}
 */
function txt(theText, theVars) {
    return _t(theText, theVars);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max, omit) {

    var x, num;

    if (typeof(omit) == 'number')    omit = [omit];
    if (typeof(omit) == 'undefined') omit = [];
    min = Math.ceil(min);
    max = Math.floor(max);
    num = Math.floor(Math.random() * (max - min + 1)) + min;
    x = 0;
    while (omit.indexOf(num) != -1 && x <= 9999) {
        x++;
        num = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return num;
}

/**
 * Move an object vertically.
 * @param {PageItem | selection}    theItem
 * @param {number}                  amount
 * @returns {*}
 */
function moveVertical(theItem, amount) {
    return move(theItem, 0, amount);
}

/**
 * Move an object horizontally.
 * @param {PageItem | selection}    theItem
 * @param {number}                  amount
 * @returns {*}
 */
function moveHorizontal(theItem, amount) {
    return move(theItem, amount, 0);
}

/**
 * Move an object.
 * @param {PageItem | selection}    theItem
 * @param {number}                  left
 * @param {number}                  top
 * @returns {*}
 */
function move(theItem, left, top) {
    try {
        var xy = theItem.position;

        left = typeof(left) == 'undefined' ? 0 : left;
        top  = typeof(top)  == 'undefined' ? 0 : top;

        theItem.position = new Point(
            xy[0] + left,
            xy[1] + top
        );
    }
    catch(e) {
        throw new Error(e);
    }
}

// ImageGrid Rules Helpers

/**
 * Background class
 * @param {object} options
 * {
 *     top         : number,
 *     left        : number,
 *     width       : number,
 *     height      : number,
 *     stroke      : boolean,
 *     strokeColor : RGBColor
 *     strokeWidth : number,
 *     fillColor   : RBGColor,
 *     name        : string
 * }
 * @returns void
 */
var Background = function(options) {

    var doc,
        box,
        top,
        left,
        width,
        height,
        artboard;

    doc      = activeDocument;
    artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    rect     = artboard.artboardRect;

    options = Utils.update({
        // Color attributes
        strokeColor : new NoColor(),
        strokeWidth : 0,
        stroke      : false,
        fillColor   : new RGB(32, 32, 32),

        // Size & position
        top         : rect[1],
        left        : rect[0],
        width       : rect[2] - rect[0],
        height      : rect[1] - rect[3],
        name        : 'bg-' + Utils.getShortID() + artboard.name
    }, options);

    try {

        box = doc.pathItems.rectangle(
            options.top,
            options.left,
            options.width,
            options.height
        );

        box.fillColor   = options.fillColor;
        box.stroke      = options.stroke;
        box.strokeColor = options.strokeColor;
        box.strokeWidth = options.strokeWidth;
        box.name = 'bg-' + artboard.name;

        return box;
    }
    catch(e) {
        Host.logger.error('Background error : ' + e);
    }
};

/**
 * Creates a new RGB Color.
 * @param r
 * @param g
 * @param b
 * @returns {RGBColor}
 * @constructor
 */
if (typeof(RBG) == 'undefined') {
    var RGB = function(r,g,b){
        var color = new RGBColor();
        color.red   = r;
        color.green = g;
        color.blue  = b;
        return color;
    };
}

/**
 * Get random icon from list of icons.
 * @param {PageItems[]}  An array of icons.
 * @returns PageItem;
 */
function getRandomIcon(theIcons) {
    return theIcons[getRandomInt(0, fileList.length-1)];
}

/**
 * Outline all of the path items in the selection.
 * @private
 */
function outlineSelectedItems(width, R, G, B) {
    var doc = app.activeDocument;

    try {
        for (var i = 0; i < 1000; i++) {
            var pathItem = doc.pathItems[i];
            if (pathItem.layer.name != doc.activeLayer.name) continue;
            if (pathItem.selected === true) {
                pathItem.stroked           = true;
                pathItem.strokeWidth       = width;
                pathItem.strokeColor.red   = R;
                pathItem.strokeColor.green = G;
                pathItem.strokeColor.blue  = B;
                pathItem.filled            = false;
            }
        }
    }
    catch(e) {
        alert('outlineSelectedItems error : ' + e);
        Host.logger.error('outlineSelectedItems error : ' + e);
    }
}

/**
 * Generate a short unique ID with collision-checking.
 */
function shortUUID() {
    var _generatedUIDs = {};
    while (true) {
        var uid = ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
        if (!_generatedUIDs.hasOwnProperty(uid)) {
            _generatedUIDs[uid] = true;
            return uid;
        }
    }
}

/**
 * Count number of layers with the given name.
 * @param   {string} theName
 * @returns {number}
 */
function countNameOccurences(theName) {
    var doc = activeDocument;
    var count = 0;
    for (var i = 0; i < doc.layers.length; i++) {
        if (doc.layers[i].name.toLowerCase() == theName.toLowerCase()) {
            count++;
        }
    }
    return count;
}

/**
 * Generate an n-length unique ID.
 * @param   {integer}   length
 * @returns {string}
 */
function shortID(length) {

    function randomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    }

    function randomLetter() {
        var exclude = [91, 92, 93, 94, 95, 96];
        var n = randomInteger(97, 122);
        while (true) {
            if (exclude.indexOf(n) == -1) {
                return String.fromCharCode(n);
            }
            n = randomInteger(65, 122);
        }
        return String.fromCharCode(n);
    }

    var _generatedUIDs = {};
    // 97 - 122 (a-z)
    // 65-90 (A-Z)
    // String.fromCharCode(65)
    var pad = "";
    for (var i=0; i<length; i++) {
        pad += randomLetter();
    }
    while (true) {
        var uid = (pad + ((Math.random() * Math.pow(36, length)) | 0).toString(36)).slice(-length);
        if (!_generatedUIDs.hasOwnProperty(uid)) {
            _generatedUIDs[uid] = true;
            return uid;
        }
    }
}

/**
 * Set the active layer by name.
 * @param   {string}    theName
 * @returns {boolean}
 */
function setActiveLayerByName(theName) {
    try {
        if (layer = getLayerByNameStem(theName)) {

            hideAllLayers([theName.toUpperCase()]);
            activeDocument.activeLayer = layer;
            activeDocument.activeLayer.visible = true;

            return true;
        }
        return false;
    }
    catch(e) {
        Host.logger.error('setActiveLayerByName to {s} error : {e}', {
            s : theName,
            e : e
        });
    }
    return false;
}

/**
 * Find layer by partial name.
 * @param theName
 * @returns {*}
 */
function getLayerByNameStem(theName) {
    var doc = activeDocument;
    try {
        for (var i = 0; i < doc.layers.length; i++) {
            var layerName = doc.layers[i].name.toUpperCase();

            if (layerName.substring(1, theName.length+1) == theName.toUpperCase()) {
                return doc.layers[i];
            }
        }
    }
    catch(e) {
        Host.logger.error('getLayerByNameStem({s}) : {e}', {
            s : theName,
            e : e
        });
    }
    return false;
}

/**
 * Hide all layers except given layers.
 * @param   {String[]} except
 * @returns {*}
 */
function hideAllLayers(except) {
    var layers     = activeDocument.layers,
        layer,
        layerName;

    try {
        for (var i = 0; i < layers.length; i++) {
            layer = layers[i];
            layerName = layer.name.toUpperCase();
            if (except.indexOf(layerName) == -1 && layer.locked === false) {
                layer.visible = false;
            }
            else {
                layer.visible = true;
            }
        }
    }
    catch(e) {
        Host.logger.error('hideAllLayers error : {e}', {
            e : e
        });
    }
}

/**
 * Alias to $.gc() (Garbage collection)
 */
function gc() {
    try { $.gc(); }
    catch(e) {/* Nothing to do here */}
}

/**
 * Get all files in subfolders.
 * @param {Folder}  srcFolder     The root folder from which to merge SVGs.
 * @returns {Array}     Array of nested files.
 */
function getFilesInSubfolders( srcFolder ) {

    if ( ! srcFolder instanceof Folder) return;

    var allFiles    = srcFolder.getFiles(),
        // theFolders  = [],
        theFolders  = getSubFolders(srcFolder),
        theFileList = [];

    logger.info(JSON.stringify(theFolders));

    if (theFolders.length == 0) {
        theFileList = Array.prototype.concat.apply([], getFilesInFolder(srcFolder));
    }
    else {
        for (var x=0; x < theFolders.length; x++) {
            theFileList = Array.prototype.concat.apply(theFileList, getFilesInFolder(theFolders[x]));
        }
    }

    return theFileList;
}

/**
 * Get all nested subfolders in theFolder.
 * @param theFolder
 * @returns {*}
 */
function getSubFolders(theFolder) {
    var subFolders = [];
    var myFileList = theFolder.getFiles();
    for (var i = 0; i < myFileList.length; i++) {
        var myFile = myFileList[i];
        if (myFile instanceof Folder) {
            subFolders.push(myFile);
            subFolders = Array.prototype.concat.apply(
                subFolders,
                getSubFolders(myFile)
            );
        }
    }
    return subFolders;
}

/**
 * Gets the files in a specific source folder.
 *
 * NOTE: You may notice that in the code below we do not use the Illustrator File method
 * `theFolder.getFiles(/\.svg$/i)` to scan the folder for a specific file type, even though
 * it would be more efficient. The reason is that from time-to-time the MacOS will not correctly
 * identify the file type and the list comes back empty when it is, in fact, not empty. To prevent
 * the script from randomly stop  working and require a system restart, we use a slightly less
 * efficient but more reliable method to identify the file extension.
 *
 * @param {Folder}  The folder object
 * @returns {Array}
 */
function getFilesInFolder(theFolder) {

    var svgFileList = [],
        aiFileList  = [],
        epsFileList = [],
        pdfFileList = [],
        theFiles,
        theFile,
        theExt;

    theFiles = theFolder.getFiles();

    for (i=0; i<theFiles.length; i++) {

        theFile = theFiles[i];
        theExt  = theFile.name.split(".").pop().toUpperCase();

        if ( theExt == FileExtensions.SVG && CONFIG.FILETYPE_SVG ) {
            svgFileList.push(theFile);
        }
        else if ( theExt == FileExtensions.AI  && CONFIG.FILETYPE_AI ) {
            aiFileList.push(theFile);
        }
        else if ( theExt == FileExtensions.EPS && CONFIG.FILETYPE_EPS ) {
            epsFileList.push(theFile);
        }
        else if ( theExt == FileExtensions.PDF && CONFIG.FILETYPE_PDF ) {
            pdfFileList.push(theFile);
        }
    }

    return Array.prototype.concat.apply([], [
        svgFileList,
        aiFileList,
        epsFileList,
        pdfFileList
    ]);
}
