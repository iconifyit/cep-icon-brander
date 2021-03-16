var reuse = [];
var threeUp,
    theOutline;

app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

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

// ****************** MAIN PREVIEW ********************
// Artboard name : full-preview@2112x5000
// ****************************************************

rules.empty();

rules.add({
    TARGET  : 'full-preview@2112x5000',
    GUTTER  : 0,
    COLS    : 6,
    ROWS    : 20,
    SCALE   : 400,
    VOFF    : 64,
    HOFF    : 64,
    SORT    : true,
    onLoad : function(fileList) {

        new Background({
            fillColor : new RGB(
                getRandomInt(230, 255),
                getRandomInt(230, 255),
                getRandomInt(230, 255)
            ),
            name : 'bg-full-preview@2112x5000'
        });

        return fileList;
    },
    onFinish : function(theIcons) {
        Host.logger.info('{count} icons were added to artboard {name}', {
            count : theIcons.length,
            name  : 'details@1800x1360-01'
        });
    }
});

// ****************** DETAIL IMAGE 01 *****************
// Artboard name : details@1800x1360-01
// ****************************************************

rules.add({
    TARGET : 'details@1800x1360-01',
    GUTTER : 0,
    COLS   : 3,
    ROWS   : 2,
    SCALE  : 800,
    VOFF   : 64,
    HOFF   : 64,
    SORT   : true,
    onLoad : function(fileList) {
        var start = 0;
        var end   = start + 6;
        Host.logger.info('Icons {start} thru {end}', {
            start : start,
            end   : end
        });

        if (fileList.length < end) end = fileList.length;

        var theSlice = fileList.slice(start, end);

        if (theSlice.length > 0) {
            new Background({
                fillColor : new RGB(
                    getRandomInt(230, 255),
                    getRandomInt(230, 255),
                    getRandomInt(230, 255)
                ),
                name : 'bg-details@1800x1360-01'
            });
        }

        return theSlice;
    },
    onFinish : function(theIcons) {
        Host.logger.info('{count} icons were added to artboard {name}', {
            count : theIcons.length,
            name  : 'details@1800x1360-01'
        });
    }
});

// ****************** DETAIL IMAGE 02 *****************
// Artboard name : details@1800x1360-02
// ****************************************************

rules.add({
    TARGET : 'details@1800x1360-02',
    GUTTER : 0,
    COLS   : 3,
    ROWS   : 2,
    SCALE  : 800,
    VOFF   : 64,
    HOFF   : 64,
    SORT   : true,
    onLoad : function(fileList) {
        var start = 6;
        var end   = start + 6;
        Host.logger.info('Icons {start} thru {end}', {
            start : start,
            end   : end
        });

        if (fileList.length < end) end = fileList.length;

        var theSlice = fileList.slice(start, end);

        if (theSlice.length > 0) {
            new Background({
                fillColor : new RGB(
                    getRandomInt(230, 255),
                    getRandomInt(230, 255),
                    getRandomInt(230, 255)
                ),
                name : 'bg-details@1800x1360-02'
            });
        }

        return theSlice;
    },
    onFinish : function(theIcons) {
        Host.logger.info('{count} icons were added to artboard {name}', {
            count : theIcons.length,
            name  : 'details@1800x1360-02'
        });
    }
});

// ****************** DETAIL IMAGE 03 *****************
// Artboard name : details@1800x1360-03
// ****************************************************

rules.add({
    TARGET : 'details@1800x1360-03',
    GUTTER : 0,
    COLS   : 3,
    ROWS   : 2,
    SCALE  : 800,
    VOFF   : 64,
    HOFF   : 64,
    SORT   : true,
    onLoad : function(fileList) {

        var start = 12;
        var end   = start + 6;

        Host.logger.info('Icons {start} thru {end}', {
            start : start,
            end   : end
        });

        if (fileList.length < end) end = fileList.length;

        var theSlice = fileList.slice(start, end);

        if (theSlice.length > 0) {
            new Background({
                fillColor : new RGB(
                    getRandomInt(230, 255),
                    getRandomInt(230, 255),
                    getRandomInt(230, 255)
                ),
                name : 'bg-details@1800x1360-03'
            });
        }

        return theSlice;
    },
    onFinish : function(theIcons) {
        Host.logger.info('{count} icons were added to artboard {name}', {
            count : theIcons.length,
            name  : 'details@1800x1360-03'
        });
    }
});

// ****************** DETAIL IMAGE 04 *****************
// Artboard name : details@1800x1360-04
// ****************************************************

rules.add({
    TARGET : 'details@1800x1360-04',
    GUTTER : 0,
    COLS   : 3,
    ROWS   : 2,
    SCALE  : 800,
    VOFF   : 64,
    HOFF   : 64,
    SORT   : true,
    onLoad : function(fileList) {
        var start = 18;
        var end   = start + 6;
        Host.logger.info('Icons {start} thru {end}', {
            start : start,
            end   : end
        });

        if (fileList.length < end) end = fileList.length;

        var theSlice = fileList.slice(start, end);

        if (theSlice.length > 0) {
            new Background({
                fillColor : new RGB(
                    getRandomInt(230, 255),
                    getRandomInt(230, 255),
                    getRandomInt(230, 255)
                ),
                name : 'bg-details@1800x1360-04'
            });
        }

        return theSlice;
    },
    onFinish : function(theIcons) {
        Host.logger.info('{count} icons were added to artboard {name}', {
            count : theIcons.length,
            name  : 'details@1800x1360-04'
        });
    }
});

// ****************** DETAIL IMAGE 05 *****************
// Artboard name : details@1800x1360-05
// ****************************************************

rules.add({
    TARGET : 'details@1800x1360-05',
    GUTTER : 0,
    COLS   : 3,
    ROWS   : 2,
    SCALE  : 800,
    VOFF   : 64,
    HOFF   : 64,
    SORT   : true,
    onLoad : function(fileList) {
        var start = 24;
        var end   = start + 6;
        Host.logger.info('Icons {start} thru {end}', {
            start : start,
            end   : end
        });

        if (fileList.length < end) end = fileList.length;

        var theSlice = fileList.slice(start, end);

        if (theSlice.length > 0) {
            new Background({
                fillColor : new RGB(
                    getRandomInt(230, 255),
                    getRandomInt(230, 255),
                    getRandomInt(230, 255)
                ),
                name : 'bg-details@1800x1360-05'
            });
        }

        return theSlice;
    },
    onFinish : function(theIcons) {
        Host.logger.info('{count} icons were added to artboard {name}', {
            count : theIcons.length,
            name  : 'details@1800x1360-05'
        });
    }
});

// ****************** DETAIL IMAGE 06 *****************
// Artboard name : details@1800x1360-06
// ****************************************************

rules.add({
    TARGET : 'details@1800x1360-06',
    GUTTER : 0,
    COLS   : 3,
    ROWS   : 2,
    SCALE  : 800,
    VOFF   : 64,
    HOFF   : 64,
    SORT   : true,
    onLoad : function(fileList) {
        var start = 30;
        var end   = start + 6;
        Host.logger.info('Icons {start} thru {end}', {
            start : start,
            end   : end
        });

        if (fileList.length < end) end = fileList.length;

        var theSlice = fileList.slice(start, end);

        if (theSlice.length > 0) {
            new Background({
                fillColor : new RGB(
                    getRandomInt(230, 255),
                    getRandomInt(230, 255),
                    getRandomInt(230, 255)
                ),
                name : 'bg-details@1800x1360-06'
            });
        }

        return theSlice;
    },
    onFinish : function(theIcons) {
        Host.logger.info('{count} icons were added to artboard {name}', {
            count : theIcons.length,
            name  : 'details@1800x1360-06'
        });
    }
});

// ****************** DETAIL IMAGE 07 *****************
// Artboard name : details@1800x1360-07
// ****************************************************

rules.add({
    TARGET : 'details@1800x1360-07',
    GUTTER : 0,
    COLS   : 3,
    ROWS   : 2,
    SCALE  : 800,
    VOFF   : 64,
    HOFF   : 64,
    SORT   : true,
    onLoad : function(fileList) {
        var start = 36;
        var end   = start + 6;
        Host.logger.info('Icons {start} thru {end}', {
            start : start,
            end   : end
        });

        if (fileList.length < end) end = fileList.length;

        var theSlice = fileList.slice(start, end);

        if (theSlice.length > 0) {
            new Background({
                fillColor : new RGB(
                    getRandomInt(230, 255),
                    getRandomInt(230, 255),
                    getRandomInt(230, 255)
                ),
                name : 'bg-details@1800x1360-07'
            });
        }

        return theSlice;
    },
    onFinish : function(theIcons) {
        Host.logger.info('{count} icons were added to artboard {name}', {
            count : theIcons.length,
            name  : 'details@1800x1360-07'
        });
    }
});

// **************** LARGE OUTLINE IMAGE ***************
// Artboard name : details@1800x1360-08
// ****************************************************

rules.add({
    TARGET : 'details@1800x1360-08',
    GUTTER : 0,
    COLS   : 2,
    ROWS   : 1,
    SCALE  : 1500,
    VOFF   : 64,
    HOFF   : 64,
    SORT   : true,
    onLoad : function(fileList) {

        new Background({
            fillColor : new RGB(
                getRandomInt(230, 255),
                getRandomInt(230, 255),
                getRandomInt(230, 255)
            ),
            name : 'bg-details@1800x1360-08'
        });

        var largeIcon = fileList[getRandomInt(0, fileList.length-1)];
        return [largeIcon, largeIcon];
    },
    onFinish : function(theIcons) {

        var theIcon;

        Host.logger.info('{count} icons were added to artboard {name}', {
            count : theIcons.length,
            name  : this.getTarget()
        });

        try {

            doc.selection = null;

            theIcon = theIcons.pop();
            theIcon.selected = true;
            app.executeMenuCommand('sendToFront');

            try {
                outlineSelectedItems(2, 0, 0, 0);
            }
            catch(e) {
                Host.logger.error('outlineSelectedItems error : {error}', {error : e});
            }

            move(theIcon, 0, -300);

            theIcons[0].selected = true;
            theIcons[1].selected = true;
            executeMenuCommand('group');
            theOutline = doc.selection[0];

            doc.selection = null;
        }
        catch(e) {
            Host.logger.error('Outline Avatar error : {error}', {error : e});
        }
    }
});

// ****************** PRODUCT CARD ********************
// Artboard name : product-card@1208x840
// ****************************************************

var threeUp;

rules.add({
    TARGET : 'product-card@1208x840',
    GUTTER : 0,
    COLS   : 3,
    ROWS   : 1,
    SCALE  : 750,
    VOFF   : 0,
    HOFF   : 0,
    SORT   : false,
    onLoad : function(fileList) {

        var ints = [];

        ints.push(getRandomInt(0, fileList.length-1, ints));
        ints.push(getRandomInt(0, fileList.length-1, ints));
        ints.push(getRandomInt(0, fileList.length-1, ints));

        Host.logger.info('Ints : ' + ints.join(', '));

        return [
            fileList[ints[0]],
            fileList[ints[1]],
            fileList[ints[2]]
        ];
    },
    onFinish : function(theIcons) {

        // Here we are arranging the icons on the Product card.
        // The middle icon is larger and in front with the two on the sides
        // slightly smaller and overlapped by the middle icon.

        try {

            Host.logger.info('{count} icons were added to artboard {name}', {
                count : theIcons.length,
                name  : 'details@1800x1360-07'
            });

            var icon1 = theIcons[0],
                icon2 = theIcons[1],
                icon3 = theIcons[2];

            icon2.resize(
                150,
                150,
                true,
                true,
                true,
                true,
                150
            );

            move(icon1, 50, 0);
            move(icon3, -50, 0);

            doc.selection = null;

            // The middle icon should be in front.
            icon2.selected = true;
            app.executeMenuCommand('sendToFront');

            icon1.selected = true;
            icon3.selected = true;
            app.executeMenuCommand('group');

            var theGroup = doc.selection[0];

            theGroup.name = 'product-card@1208x840';

            new CenterOnArtboards({
                APP_NAME  : 'cep-boilerplate-utils',
                LOGFOLDER : Config.get('LOGFOLDER')
            }).run();

            doc.selection = null;

            new Background({
                fillColor : new RGB(
                    getRandomInt(230, 255),
                    getRandomInt(230, 255),
                    getRandomInt(230, 255)
                ),
                name : 'bg-product-card@1208x840'
            });

            threeUp = theGroup;

            theGroup.selected = true;
            app.executeMenuCommand('sendToFront');

            doc.selection = null;
        }
        catch(e) {
            Host.logger.error('Product Card error : {error}', {error : e});
        }
    }
});
