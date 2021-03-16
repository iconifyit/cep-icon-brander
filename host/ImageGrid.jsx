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

if (typeof(Utils) == 'undefined') {
    try {
        console.log('Utils.jsx is required to use ImageGrid');
    }
    catch(e) {
        alert('Utils.jsx is required to use ImageGrid');
    }
}

var igCache = new Cache();

/**
 * ImageGrid class
 * @param artboard
 * @param fileList
 * @param settings
 * @constructor
 */
var ImageGrid = function(artboard, fileList, settings) {

    if (! Host.ok()) {
        return Host.exit('Host was stopped. Exiting ImageGrid constructor.');
    }

    igCache = new Cache();

    var doc,
        iter,
        cWidth,
        cHeight,
        dims,
        progress,
        theIcons = [];

    doc = activeDocument;

    dims    = new ArtboardDimensions(artboard);
    cWidth  = Math.floor(dims.width - settings.HOFF / settings.COLS );
    cHeight = Math.floor(dims.height - settings.VOFF / settings.ROWS );

    settings = Utils.update({
        ROW_HEIGHT : cHeight,
        COL_WIDTH  : cWidth,
        GUTTER     : 0,
        COLS       : 1,
        ROWS       : 1,
        PG_COUNT   : 1,
        FRM_WIDTH  : cWidth,
        FRM_HEIGHT : cHeight,
        SCALE      : 100,
        PG_WIDTH   : dims.width,
        PG_HEIGHT  : dims.height,
        VOFF       : 0,
        HOFF       : 0,
        SORT       : true
    }, settings);

    settings.COL_WIDTH  = parseInt((settings.PG_WIDTH - (settings.HOFF * 2)) / settings.COLS);
    settings.ROW_HEIGHT = parseInt((settings.PG_HEIGHT - (settings.VOFF * 2)) / settings.ROWS);
    settings.FRM_WIDTH  = settings.COL_WIDTH;
    settings.FRM_HEIGHT = settings.ROW_HEIGHT;

    Host.logger.info('SETTINGS : ' + JSON.stringify(settings));
    Host.logger.info('Set active artboard to {idx}', {
        idx : artboard.name
    });

    progress = new Progress({
        minvalue : 0,
        maxvalue : fileList.length
    }, true);

    // new CustomEvent(
    //     'progress_show', JSON.stringify({
    //         value : 0,
    //         max   : fileList.length
    //     })
    // ).dispatch();


    if ( settings.SORT ) {
        fileList = Utils.sortFileList(fileList)
    }

    for (var i = 0; i < fileList.length; i++) {

        iter = i;

        if (! Host.ok()) {
            return Host.exit('Host was stopped. Exiting fileList loop.');
        }

        var theIcon,
            bounds,
            boardWidth,
            rowCount,
            colCount,
            myRowHeight,
            myColumnWidth,
            remaining,
            myY1,
            myY2,
            x1 = 0,
            y1 = 0,
            x2 = 0,
            y2 = 0,
            iconName,
            cachedIcon,
            liveWidth,
            hoff,
            myX1,
            shiftX,
            shiftY,
            x1,
            y1;

        myRowHeight   = settings.ROW_HEIGHT + settings.GUTTER;
        myColumnWidth = settings.COL_WIDTH  + settings.GUTTER;

        for (var pageCounter = 0; pageCounter < settings.PG_COUNT; pageCounter++) {

            if (! Host.ok()) {
                return Host.exit('Host was stopped. Exiting pages loop.');
            }

            Host.logger.info('Adding icons to artboard {name}', {
                name : artboard.name
            });

            artboard.rulerOrigin = [0, 0];
            bounds               = artboard.artboardRect;
            bounds[0]            = 0;
            boardWidth           = Math.round(bounds[2] - bounds[0]);

            /**
             * loop through rows
             * @type {number}
             */

            rowCount = Math.ceil((fileList.length / settings.COLS));
            rowCount = settings.ROWS > rowCount ? rowCount : settings.ROWS ;

            for (var rowCounter = 1 ; rowCounter <= rowCount; rowCounter++) {

                if (! Host.ok()) {
                    return Host.exit(txt(
                        'Host was stopped. Exiting pages {p}, row {r}',
                        {p : pageCounter, r : rowCounter }
                    ));
                }

                myY1 = bounds[1] + settings.VOFF + (myRowHeight * (rowCounter-1));
                myY2 = myY1 + settings.FRM_HEIGHT;

                /**
                 * loop through columns
                 * @type {Number}
                 */

                colCount = settings.COLS;

                if (rowCounter > 1) {
                    remaining = Math.ceil(fileList.length - i);
                    if (remaining < colCount) {
                        colCount = remaining;
                    }
                }

                Host.logger.info('-------------------------------- IMAGE GRID ------------------------------------');

                for (var columnCounter = 1 ; columnCounter <= colCount; columnCounter++) {
                    try {

                        if (! Host.ok()) {
                            return Host.exit(txt(
                                'Host was stopped. Exiting pages {p}, row {r}, column {c}',
                                {p : pageCounter, r: rowCounter, c: columnCounter}
                            ));
                        }

                        var f = new File(fileList[i]);

                        if (f.exists) {
                            try {

                                iconName = f.name.replace('.svg', '');

                                Host.logger.info('{name} cache is {type}', {
                                    name  : iconName,
                                    type  : typeof(cachedIcon)
                                });

                                theIcon      = doc.groupItems.createFromFile(f);
                                theIcon.name = iconName;

                                progress.update("{name} imported", {name: iconName} );

                                iter++;

                                // new CustomEvent(
                                //     'progress_update', JSON.stringify({
                                //         value : iter,
                                //         max   : fileList.length
                                //     })
                                // ).dispatch();

                                Host.logger.info('Resize theIcon to {scale} %', {
                                    scale : settings.SCALE
                                });

                                if (typeof(theIcon.resize) == "function") {
                                    theIcon.resize(
                                        settings.SCALE,
                                        settings.SCALE,
                                        true,
                                        true,
                                        true,
                                        true,
                                        settings.SCALE
                                    );
                                }

                                Host.logger.info(JSON.stringify({
                                    iconWidth  : theIcon.width,
                                    iconHeight : theIcon.height
                                }));

                                liveWidth = (settings.COLS * (settings.FRM_WIDTH + settings.GUTTER)) - settings.GUTTER;
                                hoff      = Math.ceil((settings.PG_WIDTH - liveWidth) / 2);

                                myX1      = bounds[0] + hoff + (myColumnWidth * (columnCounter-1));

                                shiftX    = Math.ceil((settings.FRM_WIDTH - theIcon.width) / 2);
                                shiftY    = Math.ceil((settings.FRM_WIDTH - theIcon.height) / 2);

                                x1        = myX1 + shiftX;
                                y1        = (myY1 + shiftY) * -1;

                                theIcon.position = [ x1, y1 ];
                                theIcons.push(theIcon);

                                if (! igCache.has(iconName)) {
                                    // igCache.set(iconName, theIcon);
                                }

                                Host.logger.info(JSON.stringify({
                                    liveWidth     : liveWidth,
                                    shiftX        : shiftX,
                                    shiftY        : shiftY,
                                    x1            : x1,
                                    y1            : y1,
                                    myX1          : myX1,
                                    myY1          : myY1,
                                    hoff          : hoff,
                                    myColumnWidth : myColumnWidth,
                                    myRowHeight   : myRowHeight
                                }));

                                Host.logger.info('Set theIcon position to {x}, {y}', {x : x1, y: y1});

                                redraw();
                                gc();
                            }
                            catch(ex) {
                                Host.logger.error(ex);
                                try { theIcon.position = [0, 0]; }
                                catch(ex) {/*Exit Gracefully*/}
                            }
                        }
                        else {
                            Host.logger.error(fileList[i] + " does not exist");
                        }
                    }
                    catch(ex) {
                        Host.logger.error(ex);
                    }
                    i++;
                }
            }
        }
    }

    try {
        progress.close();
        // new CustomEvent(
        //     'progress_finish',
        //     {finish: true}
        // ).dispatch();
    }
    catch(e) {
        Host.logger.error(e);
    }

    this.getIcons = function() {
        return theIcons;
    }
};
