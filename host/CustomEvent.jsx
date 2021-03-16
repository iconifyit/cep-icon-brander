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
 * Create a new custom event object.
 * @param type
 * @param data
 * @returns {CSXSEvent}
 * @constructor
 */
function CustomEvent(type, data) {
    var event  = new CSXSEvent();
    event.type = type;
    event.data = data;
    event.extensionId = Host.getExtensionID();
    return event;
}

/*
{extensionId: "", data: {…}, appId: "", type: "progress_show", scope: "APPLICATION"}
appId : ""
data : {
    max : 24,
    value : 0
},
__proto__ :
    constructor : ƒ Object()
    hasOwnProperty :ƒ hasOwnProperty()
    isPrototypeOf : ƒ isPrototypeOf()
    propertyIsEnumerable : ƒ propertyIsEnumerable()
    toLocaleString : ƒ toLocaleString()
    toString : ƒ toString()
    valueOf : ƒ valueOf()
    __defineGetter__ : ƒ __defineGetter__()
    __defineSetter__ : ƒ __defineSetter__()
    __lookupGetter__:ƒ __lookupGetter__()
    __lookupSetter__ :
    ƒ __lookupSetter__()
    get __proto__ : ƒ __proto__()
    set __proto__ : ƒ __proto__()
    extensionId : ""
    scope : "APPLICATION"
    type : "progress_show"
    __proto__ : Object
 */
// {extensionId: "", data: {…}, appId: "", type: "progress_update", scope: "APPLICATION"}
