/**
 * FileListError class.
 * @param message
 * @param stack
 * @constructor
 */
var FileListError = function(message, stack) {
    this.name    = "FileListError";
    this.message = message || "Unknown FileListError";
    this.stack   = stack;
};
FileListError.prototype = Error.prototype;

/**
 * File Extensions constants.
 * @type {{JPG: string, PDF: string, SVG: string, GIF: string, AI: string, PNG: string, EPS: string}}
 */
var FileTypes = {

    SVG : "SVG",
    EPS : "EPS",
    AI  : "AI",
    PDF : "PDF",
    PNG : "PNG",
    JPG : "JPG",
    GIF : "GIF",

    toRegex : function(theType) {
        if (typeof(FileTypes[theType.toUpperCase()]) == 'string') {
            return new RegExp(theType.toLowerCase(), 'ig');
        }
    }
};

/**
 * Object wrapper to list files in a folder.
 * @param {Folder|string}   rootFolder  Can be a string path or Folder object.
 * @constructor
 */
var FileList = function(rootFolder) {

    if (typeof rootFolder == 'string') {
        rootFolder = new Folder(rootFolder);
    }

    /**
     * Get all files in subfolders.
     * @param {Folder}  srcFolder     The root folder from which to merge SVGs.
     * @returns {Array}     Array of nested files.
     */
    function getFilesInSubfolders( srcFolder, recurse, fileType ) {

        if (typeof recurse != 'boolean') {
            recurse = false;
        }

        if ( ! (srcFolder instanceof Folder)) return;

        var allFiles    = srcFolder.getFiles(fileType),
            theFolders  = getSubFolders(srcFolder),
            theFileList = [];

        if (! recurse || theFolders.length == 0) {
            theFileList = Array.prototype.concat.apply([], getFilesInFolder(srcFolder, fileType));
        }
        else {
            for (var x=0; x < theFolders.length; x++) {
                theFileList = Array.prototype.concat.apply(theFileList, getFilesInFolder(theFolders[x], fileType));
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
    function getFilesInFolder(theFolder, fileType) {

        var theFiles,
            theFile,
            theExt,
            fileList = [];

        theFiles = theFolder.getFiles();

        if (typeof fileType == 'string') {
            fileType = fileType.toLowerCase();

            for (i=0; i<theFiles.length; i++) {

                theFile = theFiles[i];
                theExt  = theFile.name.split(".").pop().toLowerCase();

                if ( theExt == fileType ) {
                    fileList.push(theFile);
                }
            }
        }
        else {
            fileList = theFiles;
        }

        return fileList;
    }

    /**
     * Public interface.
     */
    return {
        getFiles : function(recurse, fileType) {
            if (typeof recurse != 'boolean') recurse = false;
            if (typeof fileType == 'string') fileType = fileType.toLowerCase();
            return getFilesInSubfolders(rootFolder, recurse, fileType);
        },
        getFolders : function(recurse) {
            if (typeof recurse != 'boolean') recurse = false;
            return getSubFolders(recurse);
        }
    }
};
