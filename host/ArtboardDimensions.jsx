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
 * Artboard dimensions object that makes working with artboardRect easier.
 * @param artboard
 * @returns {{top: *, left: *, bottom: *, width: number, right: *, height: number}}
 * @constructor
 */
var ArtboardDimensions = function(artboard) {
    if (typeof(dims) == "undefined") {
        var left     = artboard.artboardRect[0];
        var top      = artboard.artboardRect[1];
        var right    = artboard.artboardRect[2];
        var bottom   = artboard.artboardRect[3];
        var dims = {
            top    : top,
            left   : left,
            right  : right,
            bottom : bottom,
            width  : Math.abs(right) - Math.abs(left),
            height : Math.abs(bottom) - Math.abs(top)
        };
    }
    return dims;
};

var SelectionDimensions = function(selection) {
    var _left     = selection.artboardRect[0];
    var _top      = selection.artboardRect[1];
    var _right    = selection.artboardRect[2];
    var _bottom   = selection.artboardRect[3];
    var _width    = parseFloat(right) - parseFloat(left);
    var dims = {
        top    : top,
        left   : left,
        right  : right,
        bottom : bottom,
        width  : parseFloat(right) - parseFloat(left),
        height : parseFloat(bottom) - parseFloat(top)
    };
}
