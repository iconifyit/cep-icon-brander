/**
 * Rule object class.
 * @param options
 * @constructor
 */
Rule = function(options) {

    this.UUID;

    /**
     * The target artboard.
     */
    this.TARGET;

    /**
     * Gutter width between objects on the artboard grid.
     */
    this.GUTTER;

    /**
     * Number of columns in icon grid.
     */
    this.COLS;

    /**
     * Number of rows in icon grid.
     */
    this.ROWS;

    /**
     * The scale of the icons.
     */
    this.SCALE;

    /**
     * The vertical margin.
     */
    this.VOFF;

    /**
     * The horizontal margin.
     */
    this.HOFF;

    /**
     * Whether or not to sort the icons.
     */
    this.SORT;

    /**
     * Whether to skip this rule.
     */
    this.SKIP;

    /**
     * Flag to tell rules engine to exit this rule immediately.
     */
    this.EXIT;
};

/**
 * RuleError class.
 * @param message
 * @param stack
 * @constructor
 */
this.RuleError = function(message, stack) {
    this.message = message || "Unknown RuleError occurred";
    this.stack   = stack;
    this.name    = "RulesError";
}
RuleError.prototype = Error.prototype;

/**
 * @returns {*}
 */
Rule.prototype.getUUID = function() {
    return this.UUID;
}

/**
 * @param theUUID
 */
Rule.prototype.setUUID = function(theUUID) {
    this.UUID = theUUID;
};

/**
 * @returns {null}
 */
Rule.prototype.getTarget = function() {
    return this.TARGET;
};

/**
 * @param value
 */
Rule.prototype.setTarget = function(value) {
    this.TARGET = value;
};

/**
 * @returns {null|number}
 */
Rule.prototype.getGutter = function() {
    return this.GUTTER;
};

/**
 * @param value
 */
Rule.prototype.setGutter = function(value) {
    this.GUTTER = value;
};

/**
 * @returns {null|number}
 */
Rule.prototype.getCols = function() {
    return this.COLS;
};

/**
 * @param value
 */
Rule.prototype.setCols = function(value) {
    this.COLS = value;
};

/**
 * @returns {null|number}
 */
Rule.prototype.getRows = function() {
    return this.ROWS;
}

/**
 * @param value
 */
Rule.prototype.setRows = function(value) {
    this.ROWS = value;
};

/**
 * @returns {null|number}
 */
Rule.prototype.getScale = function() {
    return this.SCALE;
};

/**
 * @param value
 */
Rule.prototype.setScale = function(value) {
    this.SCALE = value;
};

/**
 * @returns {null|number}
 */
Rule.prototype.getVoff = function() {
    return this.VOFF;
};

/**
 * @param value
 */
Rule.prototype.setVoff = function(value) {
    this.VOFF = value;
};

/**
 * @returns {null|number}
 */
Rule.prototype.getHoff = function() {
    return this.HOFF;
};

/**
 * @param value
 */
Rule.prototype.setHoff = function(value) {
    this.HOFF = value;
};

/**
 * @returns {boolean}
 */
Rule.prototype.getSkip = function() {
    return this.SKIP || false;
};

/**
 * @param value
 */
Rule.prototype.setSkip = function(value) {
    this.SKIP = value || false;
};

/**
 * @returns {boolean}
 */
Rule.prototype.getExit = function() {
    return this.EXIT || false;
};

/**
 * @param {bookean} value
 */
Rule.prototype.setExit = function(value) {
    this.EXIT = value || false;
};

/**
 * @returns {null|boolean}
 */
Rule.prototype.getSort = function() {
    return this.SORT;
};

/**
 * @param value
 */
Rule.prototype.setSort = function(value) {
    this.SORT = value;
};

/**
 * @param   {array}   theFiles
 * @param   {string}  order
 * @returns {array}
 */
Rule.prototype.sort = function(theFiles, order) {
    this.comparator;
    if (order == 'ASC') {
        comparator = function(a, b) {
            if (a > b) { return -1; }
            if (a < b) { return 1; }
            return 0;
        };
    }
    else {
        comparator = function(a, b) {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
        };
    }
    theFiles.sort(comparator);
    return theFiles;
};

/**
 *
 * @param theFiles
 * @returns {*}
 */
Rule.prototype.onLoad = function(theFiles) {
    return theFiles;
};

/**
 *
 * @param theIcons
 * @returns {*}
 */
Rule.prototype.onFinish = function(theIcons) {
    return theIcons;
};
