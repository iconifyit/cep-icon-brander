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

window.Client = window.Client || {};

var csInterface = csInterface || new CSInterface();

$(function() {

    // var csInterface = new CSInterface();

    /**
     * Eval a script to run in the JSX host app.
     * @param theScript
     */
    Client.eval = function(theScript) {
        csInterface.evalScript(theScript);
    };

    /**
     * Method to validate the data returned from a JSX callback
     * to make sure it is in the expected format. All results are
     * returned as a string. I recommend using stringified JSON
     * as a common format between Host and Client.
     * @param data
     */
    Client.validate = function(result) {

        Client.info("Validate : " + result);

        var data = JSON.parse(result);

        // Perform whatever validation is needed on the data here.

        if (typeof(data) != 'object') {
            throw "Host did not return a JSON object";
        }
        else if (typeof(data.value) == 'undefinied') {
            throw "Host did not return a valid value";
        }
        else if (isEmpty(data.value)) {
            throw "Host returned an empty value";
        }

        // Validation passed, return the data value.
        // I am returning a single value from the JSON
        // object but you can return the whole object.
        return data.value;
    };

    /**
     * Enabled a disabled element.
     * @param $o
     */
    Client.enable = function(subject) {
        $select(subject).removeAttr('disabled');
    };

    /**
     * Disable an eneabled element.
     * @param $o
     */
    Client.disable = function(subject) {
        $select(subject).attr('disabled', '');
    };

    /**
     * Initialize the HTML UI or update with result from a JSX script callback.
     * @param {*} result
     */
    Client.init = function(result) {

        var $import  = $("#import-button"),
            $folder  = $("#folder-button"),
            $source  = $("#source-folder"),
            $cancel  = $("#cancel-button");

        // Disable the button until we have the required data

        Client.disable($import);

        try {
            jsx.file('Host.jsx', (result) => {
                console.log('[JSX] Load host/Host.jsx', result)

                csInterface.evalScript('Host.setExtensionID("' + csInterface.getExtensionID() + '");', function(result) {
                    console.log(result);
                });

                // csInterface.evalScript('createHostInstance()', (result) => {
                //     console.log('createHostInstance', result);
                // })
            });
        }
        catch(e) {
            console.error('[JSX]', e)
        }

        try {

            // window.progress = new Progressbar('.messages', 100, true);
            //
            // csInterface.addEventListener( 'progress_show', function(event) {
            //
            //     console.log('progress_show');
            //     console.log(event);
            //
            //     window.progress.setMax(
            //         typeof(event.data.max) != 'undefined' ? event.data.max : 100
            //     );
            //
            //     window.progress.setValue(0);
            //     window.progress.show();
            // });
            //
            // csInterface.addEventListener( 'progress_update', function(event) {
            //
            //     console.log(txt('progress_update : {d}', {d : event.data.value}));
            //     console.log(event);
            //
            //     if (typeof(event.data.value) == 'undefined') {
            //         window.progress.increment();
            //     }
            //     else {
            //         window.progress.update(event.data.value);
            //     }
            // });
            //
            // csInterface.addEventListener( 'progress_finish', function(event) {
            //
            //     console.log('progress_finish');
            //     console.log(event);
            //
            //     // window.progress.hide();
            // });

            // var tid = setInterval(testProgress, 200);
            //
            // function testProgress() {
            //     if ( progress.getValue() > 99 ) {
            //         clearInterval(tid);
            //         progress.hide();
            //         progress.remove();
            //     }
            //     console.log( progress.getValue() );
            //     progress.update(parseInt(progress.getValue()) + 1);
            // }

            $cancel.click(function() {
                $cancel.blur();
                csInterface.evalScript("confirm('Are you sure you want to cancel?')", function(result) {
                    if (isTrue(result)) {
                        clearInterval(tid);
                        csInterface.evalScript('Host.kill()', function(result) {
                            console.log(result);
                            if (isTrue(result)) {
                                csInterface.evalScript('Host.reset()', function(result) {
                                    console.log(result);
                                });
                            }
                        });
                    }
                });
            });

            // Disable click on source folder field

            $source.click(function() {
                $source.blur();
            });

            // Import button click handler

            $import.mouseup(function() {
                $import.blur();
                csInterface.evalScript(
                    'Host.importIcons("' + $source.val() + '")',
                    Client.importIconsCallback
                );
            });

            // Folder button click handler

            $folder.mouseup(function() {
                Client.host('chooseFolder', null, function(srcFolderPath) {

                    $folder.blur();

                    if (! isNonEmptyString(srcFolderPath)) return;
                    if (isErrorString(srcFolderPath)) return;

                    console.log(srcFolderPath);

                    // Get the set name

                    var setName = srcFolderPath.split('/').pop();

                    // Set the active layer.

                    Client.host( 'setActiveLayerByName', setName, function(result) {
                        console.log(_t('Set active layer to {a} result : {b}', {
                            a : setName,
                            b : result
                        }));
                    });

                    // Set the source folder field

                    $source.val(srcFolderPath);

                    // Enable the import button

                    Client.enable($import);

                    // Set the button text

                    $import.text('Import set ' + setName);
                });

                // csInterface.evalScript('Host.chooseFolder()', function(srcFolderPath) {
                //
                //     $folder.blur();
                //
                //     if (! isNonEmptyString(srcFolderPath)) return;
                //     if (isErrorString(srcFolderPath)) return;
                //
                //     console.log(srcFolderPath);
                //
                //     // Get the set name
                //
                //     var setName = srcFolderPath.split('/').pop();
                //
                //     // Set the source folder field
                //
                //     $source.val(srcFolderPath);
                //
                //     // Enable the import button
                //
                //     Client.enable($import);
                //
                //     // Set the button text
                //
                //     $import.text('Import set ' + setName);
                // });
            });
        }
        catch(e) { Client.error(e); }
    };

    /**
     * Handle result of icons import.
     * @param result
     */
    Client.importIconsCallback = function(result) {
        console.log(result);
    };

    /**
     * Call Host.fn(data, callback)
     * @param fn
     * @param theData
     * @param theCallback
     * @deprecated
     */
    Client.hostMethod = function(fn, theData, theCallback) {
        csInterface.evalScript('Host.' + fn + '("' + theData + '")', theCallback);
    };

    /**
     * Call Host.fn(data, callback)
     * @param fn
     * @param data
     * @param callback
     */
    Client.host = function(fn, data, callback) {
        csInterface.evalScript('Host.' + fn + '("' + data + '")', function(result) {
            callback.call(null, result);
        });
    };

    /**
     * Send error message to log via CSInterface.
     * @param message
     */
    Client.error = function(message) {
        Client.log(message, 'error');
    };

    /**
     * Send info message to log via CSInterface.
     * @param message
     */
    Client.info = function(message) {
        Client.log(message, 'info');
    };

    /**
     * Send success message to log via CSInterface.
     * @param message
     */
    Client.success = function(message) {
        Client.log(message, 'success');
    };

    /**
     * Send warning message to log via CSInterface.
     * @param message
     */
    Client.warn = function(message) {
        Client.log(message, 'warn');
    };

    /**
     * Log a message to the client console and the host logger.
     * @param message
     */
    Client.log = function(message, type) {
        if (typeof(console[type]) == 'function') {
            console[type](message);
        }
        csInterface.evalScript('csxLogger("' + message + '", "' + type + '")')
    };

    /**
     * Flyout menu builder.
     */
    Client.initFlyoutMenu = function() {
        new FlyoutMenu({
            items : [
                { id: 'settings', label : 'Settings', enabled : true, checked : false },
                { id: 'reload',   label : 'Reload Extension', enabled : true, checked : false }
            ],
            onClick : Client.flyoutMenuClickedHandler
        }).build();
    };

    /**
     * Flyout menu click handler.
     * @param event
     */
    Client.flyoutMenuClickedHandler = function(event) {

        /**
         * @param {object} event { menuId: '{string}', menuName: '{string}'}
         */
        switch (event.data.menuId) {
            case "settings":
                Client.showSettingsDialog();
                break;

            case "reload":
                Client.reloadExtension();
                break;

            default:
                break;
        }
    };

    /**
     * Get an extension object. Defaults to current extension.
     * @param extensionId
     * @returns {*}
     */
    Client.getExtension = function( extensionId ) {
        var extension,
            extensions;

        if (typeof(extensionId) == 'undefined') {
            extensionId = CONST.EXTENSION_ID;
        }

        extensions = csInterface.getExtensions( [extensionId] );

        if ( extensions.length == 1 ) {

            extension = extensions[0];
            extension.basePath = slash( extension.basePath );
            log(extension.basePath);
        }

        return extension;
    }

    Client.reloadExtension = function() {
        try {
            window.cep.process.removeAllListeners();
            window.location.href = "index.html";
        }
        catch (e) {
            window.location.href = "index.html";
        }
    }

    /**
     * Interface to Host.showSettingsDialog()
     */
    Client.showSettingsDialog = function() {
        // csInterface.addEventListener( 'key_saved', function(e) {
        //     console.log(e.data);
        // });
        csInterface.evalScript( 'Host.showSettingsDialog()', function(result) {
            console.log(result);
        });
    }

    /**
     * Coerce any type of selector to the object it references, returned as a jQuery object.
     * @param subject
     * @returns {*}
     */
    function $select(subject) {
        var $o = subject;
        if (typeof(subject) != 'object') {
            $o = $(subject);
        }
        return $o;
    }

    // Run now

    Client.init();
    Client.hostMethod('Initial Run', Client.init);
    Client.initFlyoutMenu();
});
