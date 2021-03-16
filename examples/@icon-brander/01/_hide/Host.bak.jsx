/**
 * @author Scott Lewis <scott@atomiclotus.net>
 * @copyright 2018 Scott Lewis
 * @version 1.0.0
 * @url http://github.com/iconifyit
 * @url https://atomiclotus.net
 *
 * ABOUT:
 *
 *    This script is a very basic boilerplate for Adobe CEP extensions.
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
 * Declare the target app.
 */
#target illustrator

$.localize = true;


// var Host = {
//     showSettingsDialog : function() { alert('Show Settings') },
//     chooseFolder : function() { alert('Choose folder'); }
// }
//
//

// #include "Atomic.js";
#include "Logger.jsx";
#include "JSON.jsx";
#include "Utils.jsx";
#include "Configuration.jsx";
#include "ArtboardDimensions.jsx";
#include "CustomEvent.jsx";
#include "Progress.jsx";
#include "Helpers.jsx";
#include "Cache.js";
#include "ImageGrid.jsx";
#include "CenterOnArtboards.jsx";


/**
 * @type {{
 *      APP_NAME: string,
 *     USER: *,
 *     HOME: *,
 *     DOCUMENTS: *
 * }}
 */
var Config = new Configuration({
    APP_NAME  : 'cep-boilerplate',
    USER      : $.getenv('USER'),
    HOME      : $.getenv('HOME'),
    DOCUMENTS : Folder.myDocuments,
    LOGFOLDER : '~/Downloads/cep-boilerplate',
    RULES_DIR : '~/Downloads/cep-boilerplate/rules'
});

/**
 * Run the script using the Module patter.
 */
var Host = (function(Config) {

    var doc,
        _logger;

    if (app.documents.length > 0 ) {
        doc = app.activeDocument;
    }

    /**
     * The local scope logger object.
     * @type {Logger}
     */
    _logger = new Logger('cep-boilerplate', Config.get('LOGFOLDER'));

    /**
     * Shows the settings dialog window
     * @returns {string}
     * @private
     */
    function _showSettingsDialog() {
        var Dialog = function() {
            // Show dialog in center of screen

            dialog = Utils.window(
                "dialog",
                Utils.i18n("Enter API Key"),
                350, 175
            );

            // w1, h1, w2, h2
            dialog.apiKeyLabel   = dialog.add('statictext', [ 30, 30, 100, 60], 'API Key');
            dialog.apiKey        = dialog.add('edittext',   [100, 30, 320, 60], '');
            dialog.apiKey.active = true;

            // Cancel button

            dialog.closeBtn = dialog.add("button", [30,90,120,130], "Close", {name:"close"});
            dialog.closeBtn.onClick = function() { dialog.close(); };

            dialog.saveBtn = dialog.add("button", [230,90,320,130], "Save", {name:"save"});
            dialog.saveBtn.onClick = function(e) {

                // _saveApiKey(dialog.apiKey.text);
                dialog.close();
                // new CustomEvent('key_saved', JSON.stringify({saved: true})).dispatch();
                return false;
            };

            return dialog;
        };

        var dialog = new Dialog();

        dialog.show();

        return 'Dialog is a ' + typeof(dialog);
    }

    /**
     * Create a new CSXSEvent.
     * @param   {string}    eventType
     * @param   {*}         data
     * @returns {CSXSEvent}
     * @private
     */
    function _getNewCSEvent(type, data) {
        // Host.logger.info("Create new CSXSEvent(" + type + ", " + data + ")");
        // var event  = new CSXSEvent();
        // event.type = type;
        // event.data = data;
        // return event;
    }

    /**
     * Load external object library.
     * @returns {boolean}
     * @private
     */
    function _loadExternalObject() {
        // if (ExternalObjectIsLoadedLib) {
        //     Host.logger.info("[lib:PlugPlugExternalObject] already loaded");
        //     return true;
        // }
        // try {
        //     if (new ExternalObject("lib:\PlugPlugExternalObject")) {
        //         Host.logger.info("[lib:PlugPlugExternalObject] loaded");
        //         ExternalObjectIsLoadedLib = true;
        //         return ExternalObjectIsLoadedLib;
        //     }
        // }
        // catch (e) {
        //     throw new Error(e);
        // }
    }

    /**
     * Show select folder dialog.
     * @returns {*}
     * @private
     */
    function _chooseFolder() {
        try {
            var folder = Folder.selectDialog('Choose source folder');
            return folder.absoluteURI;
        }
        catch(e) {
            return e;
        }
    }

    /**
     * Adds a new layer for the imported icons.
     * @param {string}  newLayerName
     * @private
     */
    function _addWorkingLayer(newLayerName) {

        // Hide all except new layer.

        var doc = app.activeDocument;

        for ( i = 0; i < doc.layers.length; i++ ) {
            Host.logger.info(_t(
                'Layer {idx} is : {locked}', {
                    idx : i,
                    locked : doc.layers[i].locked ? 'locked' : 'unlocked'
                })
            );
            if (isTrue(doc.layers[i].locked)) continue;
            if (isTrue(doc.layers[i].name == newLayerName)) continue;
            doc.layers[i].visible = false;
        }

        doc.layers.add().name = newLayerName;

        redraw();
    }

    /**
     * Import the icon files.
     * @param theFolderPath
     * @private
     */
    function _importIcons(theFolderPath) {

        var doc,
            rules,
            fileList,
            artboard,
            theIcon,
            theFolder;

        if (app.documents.length == 0) {
            alert('There are no documents open');
            return 'No open documents';
        }

        doc = app.activeDocument;

        theFolder = new Folder(theFolderPath);

        fileList = Utils.getFilesInSubfolders(theFolder);

        Host.logger.info(fileList);

        /**
         * Make sure it has AI files in it…
         */
        if (fileList.length > 0) {

            // fileList = maybeSortFileList(fileList, CONFIG, logger);

            /**
             * Set the script to work with artboard rulers
             */
            app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

            /*
             * Make sure we can see all of the artboards at once.
             */
            app.executeMenuCommand('fitall');

            // Add new layer to work on.

            _addWorkingLayer(theFolder.name.toUpperCase());

            // Import the ImageGrid rules.

            rules = new Folder(RULES_DIR).getFiles(/\.svg$/i);

            // ****************** MAIN PREVIEW *****************
            // full-preview@2112x5000

            artboard = setActiveArtboard(
                getArtboardIndex('full-preview@2112x5000' )
            );

            // Main preview
            new ImageGrid(
                artboard,
                fileList,
                {
                    GUTTER     : 0,
                    COLS       : 6,
                    ROWS       : 12,
                    SCALE      : 400,
                    VOFF       : 64,
                    HOFF       : 64,
                    SORT       : true
                }
            );

            // ****************** DETAILS *****************
            // details@1800x1360-01 - details@1800x1360-07

            for ( x = 0; x < 7; x++ ) {

                artboard = setActiveArtboard(
                    getArtboardIndex('details@1800x1360-0' + (x + 1) )
                );

                var start = (x * 6);
                var end   = start + 6;

                if (fileList.length < start) continue;
                if (fileList.length < end) end = fileList.length;

                // Image Grid
                new ImageGrid(
                    artboard,
                    fileList.slice(start, end),
                    {
                        GUTTER     : 0,
                        COLS       : 3,
                        ROWS       : 2,
                        SCALE      : 800,
                        VOFF       : 64,
                        HOFF       : 64,
                        SORT       : true
                    }
                );
            }

            // ****************** LARGE OUTLINE IMAGE *****************
            // details@1800x1360-08

            artboard = setActiveArtboard(
                getArtboardIndex('details@1800x1360-08' )
            );

            var largeIcon = fileList[getRandomInt(0, fileList.length-1)];
            var theList   = [largeIcon, largeIcon];

            // Image Grid
            var theImageGrid = new ImageGrid(
                artboard,
                theList,
                {
                    GUTTER     : 0,
                    COLS       : 2,
                    ROWS       : 1,
                    SCALE      : 1500,
                    VOFF       : 64,
                    HOFF       : 64,
                    SORT       : false
                }
            );

            try {
                var theIcons = theImageGrid.getIcons();
                Host.logger.info('ImageGrid returned {count} icons', {count: theIcons.length});

                theIcon = theIcons.pop();
                theIcon.selected = true;

                _outlineSelectedItems();

                move(theIcon, 0, -300);

                // theIcon.selected = false;
            }
            catch(e) {
                Host.logger.error('Outline Avatar error : {error}', {error : e});
            }

            // ****************** PRODUCT CARD *****************
            // product-card@1208x840

            artboard = setActiveArtboard(
                getArtboardIndex('product-card@1208x840' )
            );

            var ints = [];

            ints.push(getRandomInt(0, fileList.length-1, ints));
            ints.push(getRandomInt(0, fileList.length-1, ints));
            ints.push(getRandomInt(0, fileList.length-1, ints));

            Host.logger.info('Ints : ' + ints.join(', '));

            var theList = [
                fileList[ints[0]],
                fileList[ints[1]],
                fileList[ints[2]]
            ];

            // Image Grid
            var theImageGrid = new ImageGrid(
                artboard,
                theList,
                {
                    GUTTER     : 0,
                    COLS       : 3,
                    ROWS       : 1,
                    SCALE      : 750,
                    VOFF       : 0,
                    HOFF       : 0,
                    SORT       : false
                }
            );

            // Here we are arranging the icons on the Product card.
            // The middle icon is larger and in front with the two on the sides
            // slightly smaller and overlapped by the middle icon.

            try {
                var theIcons = theImageGrid.getIcons();

                Host.logger.info('ImageGrid returned {count} icons', {count: theIcons.length});

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

                new CenterOnArtboards({
                    APP_NAME  : 'cep-boilerplate-utils',
                    LOGFOLDER : Config.get('LOGFOLDER')
                }).run();

                doc.selection = null;
            }
            catch(e) {
                Host.logger.error('Product Card error : {error}', {error : e});
            }

            // Deselect everything
            try {
                doc.selection = null;
            }
            catch(e) {
                Host.logger.error('Deselect error : {error}', {error : e});
            }

        };
        return _t('{count} avatars were imported, resized, and placed.', {count: fileList.length});
    }

    /**
     * Outline all of the path items in the selection.
     * @private
     */
    function _outlineSelectedItems() {
        var doc = app.activeDocument;

        for (i=0; i<1000; i++) {
            var pathItem = doc.pathItems[i];
            if (pathItem.layer.name != doc.activeLayer.name) continue;
            if (pathItem.selected === true) {
                _outlineItem(pathItem);
            }
        }
    }

    /**
     * Outline path item with no fill.
     * @param theItem
     * @private
     */
    function _outlineItem(theItem) {
        theItem.stroked = true;
        theItem.strokeWidth = 1;
        theItem.strokeColor = new RGB(201, 36, 193);
        theItem.filled = false;
    }

    /**
     * Public object.
     */
    return {
        logger: _logger,

        /**
         * Public function to show settings window.
         * @returns {void}
         */
        showSettingsDialog : function() {
            _showSettingsDialog();
        },

        /**
         * Choose folder.
         * @param startFolder
         * @returns {*}
         */
        chooseFolder : function() {
            return _chooseFolder();
        },

        /**
         * Import the icons.
         * @param theFolderPath
         */
        importIcons : function(theFolderPath) {
            return _importIcons(theFolderPath);
        }
    }

    // The closure takes the Configuration object as its argument.
})(Config);
