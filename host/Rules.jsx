var RulesLayerModes = {
    ADD_NEW          : 1,
    USE_ACTIVE_LAYER : 2,
    FIND_MATCHING    : 3
};

Rules = function() {

    this.layerMode = RulesLayerModes.ADD_NEW;

    this.items = [];

    this.length = this.items.length;

    this.EXIT = false;

    /**
     * Active Layer.
     */
    this.LAYER;

    /**
     * Previous Layer.
     */
    this.PREVIOUS_LAYER;
};

// Rules.prototype = Iterator.prototype;

/**
 * Sets layer mode marker.
 * @param   {boolean}   True will use the current layer to add the icons. False will add a new layer.
 * @returns {*}
 */
Rules.prototype.setLayerMode = function(value) {
    try {
        Host.logger.info('Setting Rules.layerMode to {value}', {
            value : value
        });
    }
    catch(e) { alert(e); }
    this.layerMode = value;
};

/**
 * @returns {*}
 */
Rules.prototype.getLayerMode = function() {
    try {
        Host.logger.info('Getting Rules.layerMode : {value}', {
            value : this.layerMode
        });
    }
    catch(e) { alert(e); }
    return this.layerMode;
};

/**
 * @returns {Layer}
 */
Rules.prototype.getLayer = function() {
    return this.LAYER;
}

/**
 * @param {Layer} theLayer
 */
Rules.prototype.setLayer = function(theLayer) {
    this.LAYER = theLayer;
};

/**
 * @returns {Layer}
 */
Rules.prototype.getPreviousLayer = function() {
    return this.PREVIOUS_LAYER;
}

/**
 * @param {Layer} theLayer
 */
Rules.prototype.setPreviousLayer = function(theLayer) {
    this.PREVIOUS_LAYER = theLayer;
};

/**
 * @returns {*}
 */
Rules.prototype.getRules = function() {
    this.gc();
    return this.items;
};


/**
 * @returns {boolean}
 */
Rules.prototype.getExit = function() {
    return this.EXIT || false;
};

/**
 * @param {bookean} value
 */
Rules.prototype.setExit = function(value) {
    this.EXIT = value || false;
};

/**
 * @returns {Rule}
 */
Rules.prototype.get = function(idx) {
    var rules = this.getRules();
    Host.logger.info('this.getRules() returned {count} rules', {
        count : rules.length
    });
    Host.logger.info('this.getRules() with IDX {idx}', {
        idx : idx
    });
    if (typeof(rules[idx]) == 'undefined') {
        throw new RulesError('Rule ' + idx + ' does not exist');
    }
    return rules[idx];
};

/**
 *
 */
Rules.prototype.gc = function() {
    var tmp = [];
    for (var i = 0; i < this.items.length; i++) {
        if (! this.items[i].deleted) {
            tmp.push(this.items[i]);
        }
        else {
            Host.logger.info('Rules {UUID} is marked for deletion', {
                UUID : this.items[i].getUUID()
            });
        }
    }
    this.items = tmp;
};

/**
 *
 * @param theRule
 */
Rules.prototype.add = function(theRule) {

    var newRule = new Rule();

    newRule.setUUID(Utils.generateUUID());
    newRule.setTarget(theRule.TARGET);
    newRule.setGutter(theRule.GUTTER);
    newRule.setCols(theRule.COLS);
    newRule.setRows(theRule.ROWS);
    newRule.setScale(theRule.SCALE);
    newRule.setVoff(theRule.VOFF);
    newRule.setHoff(theRule.HOFF);
    newRule.setSort(theRule.SORT);

    Host.logger.info('Adding rule for target {target} with UUID {UUID}', {
        target : newRule.getTarget(),
        UUID   : newRule.getUUID()
    });

    if (typeof(theRule.onLoad) == 'function') {
        newRule.onLoad = theRule.onLoad;
    }

    if (typeof(theRule.onFinish) == 'function') {
        newRule.onFinish = theRule.onFinish;
    }

    Host.logger.info('Rules has {x} rules', {
        x : this.getLength()
    });

    this.items.push(newRule);
};

/**
 * Empties the Rules object's internal list.
 */
Rules.prototype.empty = function() {
    this.items = [];
};

/**
 * @param theRule
 */
Rules.prototype.remove = function(theRule) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].UUID == theRule.UUID) {
            this.items[i].deleted = true;
        }
    }
};

/**
 * @returns {number}
 */
Rules.prototype.getLength = function() {
    return this.items.length;
}

/**
 * RulesError class.
 * @param message
 * @param stack
 * @constructor
 */
var RulesError = function(message, stack) {
    this.message = message || "Unknown RulesError occurred";
    this.stack   = stack;
    this.name    = "RulesError";
}
RulesError.prototype = Error.prototype;
