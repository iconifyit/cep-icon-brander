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
 * Re-usable module for centering selection on artboards.
 * @param Config
 * @returns {{run: run}}
 * @constructor
 */
var CenterOnArtboards = function(Config) {

    var logger,
        doc,
        board,
        right,
        bottom;

    // Create a logger instance.
    logger = new Logger(Config.APP_NAME, Config.LOGFOLDER);

    // Document reference
    doc = app.activeDocument;

    /**
     * Create a new instance of this module.
     * @constructor
     */
    var Instance = function() {
        app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

        if (doc.selection.length > 0) {
            try {

                board  = doc.artboards[doc.artboards.getActiveArtboardIndex()];
                right  = board.artboardRect[2];
                bottom = board.artboardRect[3];

                doc.selectObjectsOnActiveArtboard();
                app.executeMenuCommand('group');

                for (x = 0 ; x < doc.selection.length; x++) {
                    try {
                        doc.selection[x].position = [
                            Math.round((right - doc.selection[x].width)/2),
                            Math.round((bottom + doc.selection[x].height)/2)
                        ];
                    }
                    catch(e) { logger.error(e); }
                }
            }
            catch(e) { logger.error(e); }
            redraw();
            return;
        }
    }

    /**
     * Returns the public module object.
     */
    return {
        /**
         * Runs the module code.
         */
        run: function() {
            new Instance();
        }
    }

};
