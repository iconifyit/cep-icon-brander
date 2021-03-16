/**
 * Create the csInterface if it doesn't exist.
 * @type {A}
 */
var csInterface = csInterface || new CSInterface();

/**
 * Progressbar
 * @constructor
 */
window.Progressbar = function(selector, max, show) {

    var parentNode;

    // It's an ID

    if (selector.charAt(0) == '#') {
        parentNode = document.getElementById(
            selector.substring(1, selector.length)
        );
    }

    // It's a class

    else if (selector.charAt(0) == '.') {
        parentNode = document.querySelector(selector);
    }

    // It's an element

    else {

        document.getElementsByTagName(selector)[0];
    }

    // Store a reference to the parent node.

    if (! parentNode) {
        throw new ProgressbarError(this._t(
            "No element with selector '{s}' was found",
            selector
        ));
    }

    // csInterface.addEventListener( 'progress_show', function(event) {
    //     window.progress.show();
    // });
    //
    // csInterface.addEventListener( 'progress_update', function(event) {
    //     event = JSON.parse(event);
    //     window.progress.update(event.data);
    // });
    //
    // csInterface.addEventListener( 'progress_finish', function() {
    //     window.progress.hide();
    // });

    this.parent = parentNode;

    console.log(this.parent);

    // Add the progress element.

    this.progress = this.parent.appendChild(
        document.createElement('PROGRESS')
    );

    max = typeof max == 'undefined' ? 100 : max;

    this.setMax(max);
    this.setValue(0);

    if (show) this.show();
}


/**
 * Increment the ProgressBar value by 1.
 * @returns void
 */
Progressbar.prototype.increment = function() {
    this.setValue(
        this.getValue() < this.getMax() ? this.getValue() + 1 : this.getMax()
    );
};

/**
 * Decreases the ProgressBar value by 1.
 * @returns void
 */
Progressbar.prototype.decrement = function() {
    this.setValue(
        this.getValue() > 0 ? this.getValue() - 1 : 0
    );
}

/**
 * Sets the max value of the ProgressBar
 * @param {number} max
 * @returns void
 */
Progressbar.prototype.setMax = function(max) {
    this.progress.setAttribute('max', max || 100);
};

/**
 * Gets the max value of the ProgressBar
 * @returns {number}
 */
Progressbar.prototype.getMax = function() {
    return this.progress.getAttribute('max');
};

/**
 * Set the text on the ProgressBar
 * @param text
 * @returns void
 */
Progressbar.prototype.setText = function(text) {
    this.progress.innerText = text;
};

/**
 * Get the innerText of the ProgressBar.
 * @returns {string | *}
 */
Progressbar.prototype.getText = function() {
    return this.prototype.innerText;
};

/**
 * Get the current value of the ProgressBar.
 * @returns {string}
 */
Progressbar.prototype.getValue = function() {
    return Number(this.progress.getAttribute('value').valueOf());
};

/**
 * Sets the current value of the ProgressBar.
 * @param   {number} value
 * @returns void
 */
Progressbar.prototype.setValue = function(value) {
    this.progress.setAttribute('value', value);
};

/**
 * Updates the value of the ProgressBar.
 * @param value
 * @returns void
 */
Progressbar.prototype.update = function(value) {
    this.setValue(value);
    if (this.getValue() > this.getMax() - 1) {
        this.reset();
    }
};

/**
 * Resets the ProgressBar to its default state (value of 0 & hidden)
 * @returns void
 */
Progressbar.prototype.reset = function() {
    this.hide();
    this.progress.setAttribute('value', 0);
};

/**
 * Show the ProgressBar.
 * @returns void
 */
Progressbar.prototype.show = function() {

    this.parent.style.display   = 'block';
    this.progress.style.display = 'block';
};

/**
 * Hides the ProgressBar.
 * @returns void
 */
Progressbar.prototype.hide = function() {

    this.progress.style.display = 'none';
}

/**
 * Removes the ProgressBar from the DOM.
 * @returns void
 */
Progressbar.prototype.remove = function() {

    this.progress.remove();
};

/**
 * String tokenizer function.
 * @param   {string}    theText
 * @param   {object}    theVars     key => value pairs of tokens to replace in theMessage
 * @returns {string}
 * @private
 */
Progressbar.prototype._t = function(theText, theVars) {

    var flags = "";

    if (typeof(theVars) == 'string') {
        theVars = {s: theVars};
    }
    else if (typeof(theVars) == 'number') {
        theVars = {d: theVars};
    }
    else {
        flags = "g";
    }

    for (token in theVars) {
        theText = theText.replace(
            new RegExp("{" + token + "}",flags),
            theVars[token]
        );
    }
    return theText;
};


/**
 * ProgressbarError
 * @param message
 * @param stack
 * @constructor
 */
var ProgressbarError = function(message, stack) {
    this.message = message || 'Unknown Progressbar error';
    this.stack   = stack || 'Progressbar.js';
}
ProgressbarError.prototype = Error.prototype;
