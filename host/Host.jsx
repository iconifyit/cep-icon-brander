$.localize = true;

// #include "Atomic.js";
#include "Logger.jsx";
#include "prototypes.js";
#include "JSON.jsx";
#include "Utils.jsx";
#include "FileList.js";
#include "Configuration.jsx";
#include "ArtboardDimensions.jsx";
#include "CustomEvent.jsx";
#include "Progress.jsx";
#include "Helpers.jsx";
#include "Cache.js";
#include "ImageGrid.jsx";
#include "CenterOnArtboards.jsx";
#include "Iterator.jsx";
#include "Rules.jsx";
#include "Rule.jsx";


/*
 * Set some global References.
 */
var doc       = app.activeDocument,
    layers    = doc.layers,
    artboards = doc.artboards;

/**
 * @type {{
 *     APP_NAME  : {string},
 *     USER      : {*},
 *     HOME      : {*},
 *     DOCUMENTS : {*}
 * }}
 */
var Config = new Configuration({
    APP_NAME  : '@icon-brander',
    USER      : $.getenv('USER'),
    HOME      : $.getenv('HOME'),
    DOCUMENTS : Folder.myDocuments,
    LOGFOLDER : '~/Downloads/@icon-brander/logs',
    RULES_DIR : '~/Downloads/@icon-brander/02/rules',
    USER_DATA : '~/Downloads/@icon-brander'
});

/**
 * Create the global rules object.
 * @type {Rules}
 */
var rules = new Rules();

/**
 * Host status constants.
 * @type {{
 *     STOPPED : {number},
 *     OK      : {number}
 * }}
 */
var HostStatuses = {
    OK      : 0,
    STOPPED : 1
};

console.log('Test HOST console');

/*
 * Run the script using the Module pattern.
 */
var Host = (function(Config) {

    /*
     * Set scope vars.
     */
    var doc,
        _logger,
        _extensionId;

    /*
     * The External object lib for sending custom events to client.
     */
    var ExternalObjectIsLoadedLib = false;

    /*
     * Get our active document reference.
     */
    if (app.documents.length > 0 ) {
        doc = app.activeDocument;
    }

    /**
     * The local scope logger object.
     * @type {Logger}
     */
    _logger = new Logger('@icon-brander', Config.get('LOGFOLDER'));

    /*
     * Clear the old logs.
     */
    _logger.clear();

    /*
     * Are we in debug mode?
     */
    try {
        _logger.info('Debug file : {s}', {s: Config.USER_DATA + '/debug'});

        var DEBUG = (new File(Config.get('USER_DATA') + '/debug')).exists;

        _logger.info('Debug file {s} exist', {
            s: (DEBUG ? 'does' : 'does not')
        });

        console.log('Debug file ' + ( DEBUG ? 'does' : 'does not' ) + ' exist');
    }
    catch(e) {
        _logger.error('Error setting DEBUG {s}', {
            s: e
        });
    }

     /*
      *  0 = Everything is good, still working.
      *  1 = stopped.
      * -1 = Something is wrong, stop where you're doing.
      */

    var _status = HostStatuses.OK;

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
        Host.logger.info("Create new CSXSEvent(" + type + ", " + data + ")");
        var event  = new CSXSEvent();
        event.type = type;
        event.data = data;
        return event;
    }

    /**
     * Load external object library.
     * @returns {boolean}
     * @private
     */
    function _loadExternalObject() {
        if (ExternalObjectIsLoadedLib) {
            _logger.info("[lib:PlugPlugExternalObject] already loaded");
            return true;
        }
        try {
            if (new ExternalObject("lib:\PlugPlugExternalObject")) {
                _logger.info("[lib:PlugPlugExternalObject] loaded");
                ExternalObjectIsLoadedLib = true;
                return ExternalObjectIsLoadedLib;
            }
        }
        catch (e) {
            _logger.error('_loadExternalObject error : ' + e);
            throw new Error(e);
        }
    }

    /*
     * Load the external object library.
     */
    _loadExternalObject();

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
            // doc.layers[i].visible = false;
        }

        var newLayer = doc.layers.add().name = newLayerName;

        redraw();

        return newLayer;
    }

    /**
     * Import the icon files.
     * @param theFolderPath
     * @private
     */
    function _importIcons(theFolderPath) {

        var doc,
            ruleFiles,
            fileList,
            artboard,
            theIcon,
            theFolder;

        /*
         * Make sure we have an active document.
         */

        if (app.documents.length == 0) {
            alert('There are no documents open');
            return 'No open documents';
        }

        /*
         * If some other code has indicated the app needs to stop, do it now.
         */

        if (_status != HostStatuses.OK) {
            return Host.exit(txt(
                'Host is stopped. Exiting _importIcons with status {s}',
                {s: _status}
            ));
        }

        /*
         * Set reference to the active document.
         */

        doc = app.activeDocument;

        /*
         * Get a reference to the Folder object.
         */

        theFolder = new Folder(theFolderPath);

        /*
         * Get the list of icon files.
         */

        // fileList = getFilesInSubfolders(theFolder);

        fileList = new FileList(theFolder).getFiles(true, 'svg');

        // Debug
        // Host.logger.info(fileList);

        /**
         * Make sure it has AI files in it…
         */
        if (fileList.length > 0) {

            /**
             * Set the script to work with artboard rulers
             */
            app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

            /*
             * Make sure we can see all of the artboards at once.
             */
            app.executeMenuCommand('fitall');

            /*
             * Load the rules files.
             */

            rules = new Rules();
            ruleFiles = Utils.sortFileList(
                new Folder(Config.get('RULES_DIR')).getFiles(/\.jsx$/i)
            );

            console.log('RULES', ruleFiles.join('\n'))

            /*
             * Log some debug info.
             */

            _logger.info(repeat('--', 15) + " START RULES " + repeat("--", 15) + "\n");
            _logger.info(rules.toSource());
            _logger.info(rules.toString());
            _logger.info(JSON.stringify(rules));
            _logger.info(repeat('--', 15) + " END RULES " + repeat("--", 15) + "\n");

            /*
             * Import the ImageGrid rules.
             */

            for (var i = 0; i < ruleFiles.length; i++) {
                $.evalFile( ruleFiles[i] );
            }

            // Debug

            var prefix = repeat("--", 15) + " RULES COUNT " + repeat("--", 15) + "\n";

            Host.logger.info(prefix + 'There are {count} rules', {
                count : rules.getLength()
            });

            /*
             * Set working layers.
             */

            rules.setPreviousLayer(doc.activeLayer);

            /*
             * Create a new layer name in case we need it.
             */
            var newLayerName = theFolder.name.toUpperCase();

            /*
             * Count number of occurrences of the new name so we can increment it.
             */

            if (countNameOccurences(newLayerName)) {
                newLayerName = newLayerName  + '--' + addLeadingZeros(
                    countNameOccurences(newLayerName), 2
                );
            }

            /*
             * Determine whether to use an existing layer or add new.
             */

            if (rules.getLayerMode() === RulesLayerModes.ADD_NEW) {
                _addWorkingLayer(newLayerName + '--' + shortUUID());
            }
            else if (rules.getLayerMode() === RulesLayerModes.FIND_MATCHING) {

                /*
                 * Try to find a layer to match the folder name. If we can't find
                 * one, add a new layer.
                 */
                try {
                    doc.activeLayer = doc.layers.getByName(theFolder.name.toUpperCase());
                }
                catch(e) {
                    _addWorkingLayer(newLayerName + '--' + shortUUID());
                }
            }

            /*
             * Add a reference to the current layer to the Rules object.
             *
             */
            rules.setLayer(doc.activeLayer);

            /*
             * Iterate through the rules to execute them.
             */

            for (var i = 0; i < rules.getLength(); i++) {

                Host.logger.info(prefix + 'The value of i is {x} ', { x : i });

                var theRule = rules.get(i);

                if (theRule.getSkip()) continue;
                if (rules.getExit()) break;

                // Host.logger.info(repeat("--", 15) + " THE RULE " + repeat("--", 15) + "\n");
                // Host.logger.info(theRule.toSource());

                var prefix = repeat("--", 15) + " RULES TARGET " + repeat("--", 15) + "\n";

                Host.logger.info(prefix + 'The rule target : {target}', {
                    target : theRule.getTarget()
                });

                artboard = setActiveArtboard(
                    getArtboardIndex(theRule.getTarget())
                );

                var prefix = repeat("--", 15) + " ARTBOARD INDEX " + repeat("--", 15) + "\n";

                Host.logger.info(prefix + 'This should go on artboard {x}', {
                    x : getArtboardIndex(theRule.getTarget())
                });

                var filtered = fileList;
                if (typeof(theRule.onLoad) == 'function') {
                    filtered = theRule.onLoad.call(theRule, fileList);
                }

                if (theRule.getExit()) break;
                if (rules.getExit()) break;

                // You can skip this step by returning an empty array from the Rule.onLoad method.

                var imageGrid = new ImageGrid(
                    artboard,
                    filtered,
                    {
                        GUTTER : theRule.getGutter(),
                        COLS   : theRule.getCols(),
                        ROWS   : theRule.getRows(),
                        SCALE  : theRule.getScale(),
                        VOFF   : theRule.getVoff(),
                        HOFF   : theRule.getHoff(),
                        SORT   : theRule.getSort()
                    }
                );

                if (typeof(theRule.onFinish) == 'function') {
                    theRule.onFinish.call(theRule, imageGrid.getIcons());
                }

                gc();
            }

            // Deselect everything

            try {
                doc.selection = null;
            }
            catch(e) {
                Host.logger.error('Deselect error : {error}', {error : e});
            }

            try {
                app.activeDocument.save();
            }
            catch(e) {
                Host.logger.error('Could not save the document : {error}', {error : e});
            }

        };
        return _t('{count} avatars were imported, resized, and placed.', {count: fileList.length});
    }

    /**
     * Outline all of the path items in the selection.
     * @param {number}      width
     * @param {number}      R       Red
     * @param {number}      G       Green
     * @param {number}      B       Blue
     * @private
     */
    function _outlineSelectedItems(width, R, G, B) {
        var doc = app.activeDocument;

        for (i=0; i<1000; i++) {
            var pathItem = doc.pathItems[i];
            if (pathItem.layer.name != doc.activeLayer.name) continue;
            if (pathItem.selected === true) {
                _outlineItem(pathItem, width, R, G, B);
            }
        }
    }

    /**
     * Outline path item with no fill.
     * @param {PageItem}    theItem
     * @param {number}      width
     * @param {number}      R       Red
     * @param {number}      G       Green
     * @param {number}      B       Blue
     * @private
     */
    function _outlineItem(theItem, width, R, G, B) {

        theItem.stroked     = true;
        theItem.strokeWidth = width;
        theItem.strokeColor = new RGB(R, G, B);
        theItem.filled      = false;
    }

    /**
     * Public object.
     */
    return {
        logger: _logger,

        getExtensionID : function() {
            return _extensionId;
        },

        setExtensionID : function(extensionId) {
            _extensionId = extensionId;
            return Host.getExtensionID();
        },

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
         * Set the active layer by name.
         * @param theName
         * @returns {boolean}
         */
        setActiveLayerByName : function(theName) {
            return setActiveLayerByName(theName);
        },

        /**
         * Import the icons.
         * @param theFolderPath
         */
        importIcons : function(theFolderPath) {
            return _importIcons(theFolderPath);
        },

        stopped : function() {
            return _status === HostStatuses.STOPPED;
        },

        stop : function() {
            _status = HostStatuses.STOPPED;

            try {
                new CustomEvent(
                    'progress_finish',
                    JSON.stringify({finish: true})
                ).dispatch();
            }
            catch(e) {
                return 'CustomEvent error ' + e;
            }

            return 'Host stopped with status ' + _status;
        },

        reset : function() {
            _status = HostStatuses.OK;
            return 'Host reset with status ' + _status;
        },

        setStatus : function(status) {
            _status = status;
        },

        getStatus : function() {
            return _status;
        },

        ok : function() {
            return parseInt(_status) === 0 ;
        },

        exit : function(message) {
            try {
                new CustomEvent(
                    'progress_finish',
                    JSON.stringify({finish: true})
                ).dispatch();
            }
            catch(e) {/* Nothing much to do here. */}

            _status = HostStatuses.OK;

            _logger.info(message);

            return message;
        }
    }

    // The closure takes the Configuration object as its argument.
})(Config);
