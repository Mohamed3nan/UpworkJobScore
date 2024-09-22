// export var Arrive = function (e, t, n) { "use strict"; function r(e, t, n) { l.addMethod(t, n, e.unbindEvent), l.addMethod(t, n, e.unbindEventWithSelectorOrCallback), l.addMethod(t, n, e.unbindEventWithSelectorAndCallback) } function i(e) { e.arrive = f.bindEvent, r(f, e, "unbindArrive"), e.leave = d.bindEvent, r(d, e, "unbindLeave") } if (e.MutationObserver && "undefined" != typeof HTMLElement) { var o = 0, l = function () { var t = HTMLElement.prototype.matches || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector; return { matchesSelector: function (e, n) { return e instanceof HTMLElement && t.call(e, n) }, addMethod: function (e, t, r) { var i = e[t]; e[t] = function () { return r.length == arguments.length ? r.apply(this, arguments) : "function" == typeof i ? i.apply(this, arguments) : n } }, callCallbacks: function (e, t) { t && t.options.onceOnly && 1 == t.firedElems.length && (e = [e[0]]); for (var n, r = 0; n = e[r]; r++)n && n.callback && n.callback.call(n.elem, n.elem); t && t.options.onceOnly && 1 == t.firedElems.length && t.me.unbindEventWithSelectorAndCallback.call(t.target, t.selector, t.callback) }, checkChildNodesRecursively: function (e, t, n, r) { for (var i, o = 0; i = e[o]; o++)n(i, t, r) && r.push({ callback: t.callback, elem: i }), i.childNodes.length > 0 && l.checkChildNodesRecursively(i.childNodes, t, n, r) }, mergeArrays: function (e, t) { var n, r = {}; for (n in e) e.hasOwnProperty(n) && (r[n] = e[n]); for (n in t) t.hasOwnProperty(n) && (r[n] = t[n]); return r }, toElementsArray: function (t) { return n === t || "number" == typeof t.length && t !== e || (t = [t]), t } } }(), c = function () { var e = function () { this._eventsBucket = [], this._beforeAdding = null, this._beforeRemoving = null }; return e.prototype.addEvent = function (e, t, n, r) { var i = { target: e, selector: t, options: n, callback: r, firedElems: [] }; return this._beforeAdding && this._beforeAdding(i), this._eventsBucket.push(i), i }, e.prototype.removeEvent = function (e) { for (var t, n = this._eventsBucket.length - 1; t = this._eventsBucket[n]; n--)if (e(t)) { this._beforeRemoving && this._beforeRemoving(t); var r = this._eventsBucket.splice(n, 1); r && r.length && (r[0].callback = null) } }, e.prototype.beforeAdding = function (e) { this._beforeAdding = e }, e.prototype.beforeRemoving = function (e) { this._beforeRemoving = e }, e }(), a = function (t, r) { var i = new c, o = this, a = { fireOnAttributesModification: !1 }; return i.beforeAdding(function (n) { var i, l = n.target; (l === e.document || l === e) && (l = document.getElementsByTagName("html")[0]), i = new MutationObserver(function (e) { r.call(this, e, n) }); var c = t(n.options); i.observe(l, c), n.observer = i, n.me = o }), i.beforeRemoving(function (e) { e.observer.disconnect() }), this.bindEvent = function (e, t, n) { t = l.mergeArrays(a, t); for (var r = l.toElementsArray(this), o = 0; o < r.length; o++)i.addEvent(r[o], e, t, n) }, this.unbindEvent = function () { var e = l.toElementsArray(this); i.removeEvent(function (t) { for (var r = 0; r < e.length; r++)if (this === n || t.target === e[r]) return !0; return !1 }) }, this.unbindEventWithSelectorOrCallback = function (e) { var t, r = l.toElementsArray(this), o = e; t = "function" == typeof e ? function (e) { for (var t = 0; t < r.length; t++)if ((this === n || e.target === r[t]) && e.callback === o) return !0; return !1 } : function (t) { for (var i = 0; i < r.length; i++)if ((this === n || t.target === r[i]) && t.selector === e) return !0; return !1 }, i.removeEvent(t) }, this.unbindEventWithSelectorAndCallback = function (e, t) { var r = l.toElementsArray(this); i.removeEvent(function (i) { for (var o = 0; o < r.length; o++)if ((this === n || i.target === r[o]) && i.selector === e && i.callback === t) return !0; return !1 }) }, this }, s = function () { function e(e) { var t = { attributes: !1, childList: !0, subtree: !0 }; return e.fireOnAttributesModification && (t.attributes = !0), t } function t(e, t) { e.forEach(function (e) { var n = e.addedNodes, i = e.target, o = []; null !== n && n.length > 0 ? l.checkChildNodesRecursively(n, t, r, o) : "attributes" === e.type && r(i, t, o) && o.push({ callback: t.callback, elem: i }), l.callCallbacks(o, t) }) } function r(e, t) { return l.matchesSelector(e, t.selector) && (e._id === n && (e._id = o++), -1 == t.firedElems.indexOf(e._id)) ? (t.firedElems.push(e._id), !0) : !1 } var i = { fireOnAttributesModification: !1, onceOnly: !1, existing: !1 }; f = new a(e, t); var c = f.bindEvent; return f.bindEvent = function (e, t, r) { n === r ? (r = t, t = i) : t = l.mergeArrays(i, t); var o = l.toElementsArray(this); if (t.existing) { for (var a = [], s = 0; s < o.length; s++)for (var u = o[s].querySelectorAll(e), f = 0; f < u.length; f++)a.push({ callback: r, elem: u[f] }); if (t.onceOnly && a.length) return r.call(a[0].elem, a[0].elem); setTimeout(l.callCallbacks, 1, a) } c.call(this, e, t, r) }, f }, u = function () { function e() { var e = { childList: !0, subtree: !0 }; return e } function t(e, t) { e.forEach(function (e) { var n = e.removedNodes, i = []; null !== n && n.length > 0 && l.checkChildNodesRecursively(n, t, r, i), l.callCallbacks(i, t) }) } function r(e, t) { return l.matchesSelector(e, t.selector) } var i = {}; d = new a(e, t); var o = d.bindEvent; return d.bindEvent = function (e, t, r) { n === r ? (r = t, t = i) : t = l.mergeArrays(i, t), o.call(this, e, t, r) }, d }, f = new s, d = new u; t && i(t.fn), i(HTMLElement.prototype), i(NodeList.prototype), i(HTMLCollection.prototype), i(HTMLDocument.prototype), i(Window.prototype); var h = {}; return r(f, h, "unbindAllArrive"), r(d, h, "unbindAllLeave"), h } }(window, "undefined" == typeof jQuery ? null : jQuery, void 0);


/*
 * arrive.js
 * v2.4.1
 * https://github.com/uzairfarooq/arrive
 * MIT licensed
 *
 * Copyright (c) 2014-2017 Uzair Farooq
 */

// var Arrive=function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback)}function i(e){e.arrive=f.bindEvent,r(f,e,"unbindArrive"),e.leave=d.bindEvent,r(d,e,"unbindLeave")}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n)},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n}},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r)},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t}}}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null)}},e.prototype.beforeAdding=function(e){this._beforeAdding=e},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e},e}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding(function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver(function(e){r.call(this,e,n)});var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o}),i.beforeRemoving(function(e){e.observer.disconnect()}),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n)},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent(function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1})},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1},i.removeEvent(t)},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent(function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1})},this},s=function(){function e(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t}function t(e,t){e.forEach(function(e){var n=e.addedNodes,i=e.target,o=[];null!==n&&n.length>0?l.checkChildNodesRecursively(n,t,r,o):"attributes"===e.type&&r(i,t,o)&&o.push({callback:t.callback,elem:i}),l.callCallbacks(o,t)})}function r(e,t){return l.matchesSelector(e,t.selector)&&(e._id===n&&(e._id=o++),-1==t.firedElems.indexOf(e._id))?(t.firedElems.push(e._id),!0):!1}var i={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};f=new a(e,t);var c=f.bindEvent;return f.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t);var o=l.toElementsArray(this);if(t.existing){for(var a=[],s=0;s<o.length;s++)for(var u=o[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:r,elem:u[f]});if(t.onceOnly&&a.length)return r.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a)}c.call(this,e,t,r)},f},u=function(){function e(){var e={childList:!0,subtree:!0};return e}function t(e,t){e.forEach(function(e){var n=e.removedNodes,i=[];null!==n&&n.length>0&&l.checkChildNodesRecursively(n,t,r,i),l.callCallbacks(i,t)})}function r(e,t){return l.matchesSelector(e,t.selector)}var i={};d=new a(e,t);var o=d.bindEvent;return d.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t),o.call(this,e,t,r)},d},f=new s,d=new u;t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var h={};return r(f,h,"unbindAllArrive"),r(d,h,"unbindAllLeave"),h}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);


/*globals jQuery,Window,HTMLElement,HTMLDocument,HTMLCollection,NodeList,MutationObserver */
/*exported Arrive*/
/*jshint latedef:false */

/*
 * arrive.js
 * v2.4.1
 * https://github.com/uzairfarooq/arrive
 * MIT licensed
 *
 * Copyright (c) 2014-2017 Uzair Farooq
 */
var Arrive = (function (window, $, undefined) {

    "use strict";

    if (!window.MutationObserver || typeof HTMLElement === 'undefined') {
        return; //for unsupported browsers
    }

    var arriveUniqueId = 0;

    var utils = (function () {
        var matches = HTMLElement.prototype.matches || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector
            || HTMLElement.prototype.msMatchesSelector;

        return {
            matchesSelector: function (elem, selector) {
                return elem instanceof HTMLElement && matches.call(elem, selector);
            },
            // to enable function overloading - By John Resig (MIT Licensed)
            addMethod: function (object, name, fn) {
                var old = object[name];
                object[name] = function () {
                    if (fn.length == arguments.length) {
                        return fn.apply(this, arguments);
                    }
                    else if (typeof old == 'function') {
                        return old.apply(this, arguments);
                    }
                };
            },
            callCallbacks: function (callbacksToBeCalled, registrationData) {
                if (registrationData && registrationData.options.onceOnly && registrationData.firedElems.length == 1) {
                    // as onlyOnce param is true, make sure we fire the event for only one item
                    callbacksToBeCalled = [callbacksToBeCalled[0]];
                }

                for (var i = 0, cb; (cb = callbacksToBeCalled[i]); i++) {
                    if (cb && cb.callback) {
                        cb.callback.call(cb.elem, cb.elem);
                    }
                }

                if (registrationData && registrationData.options.onceOnly && registrationData.firedElems.length == 1) {
                    // unbind event after first callback as onceOnly is true.
                    registrationData.me.unbindEventWithSelectorAndCallback.call(
                        registrationData.target, registrationData.selector, registrationData.callback);
                }
            },
            // traverse through all descendants of a node to check if event should be fired for any descendant
            checkChildNodesRecursively: function (nodes, registrationData, matchFunc, callbacksToBeCalled) {
                // check each new node if it matches the selector
                for (var i = 0, node; (node = nodes[i]); i++) {
                    if (matchFunc(node, registrationData, callbacksToBeCalled)) {
                        callbacksToBeCalled.push({ callback: registrationData.callback, elem: node });
                    }

                    if (node.childNodes.length > 0) {
                        utils.checkChildNodesRecursively(node.childNodes, registrationData, matchFunc, callbacksToBeCalled);
                    }
                }
            },
            mergeArrays: function (firstArr, secondArr) {
                // Overwrites default options with user-defined options.
                var options = {},
                    attrName;
                for (attrName in firstArr) {
                    if (firstArr.hasOwnProperty(attrName)) {
                        options[attrName] = firstArr[attrName];
                    }
                }
                for (attrName in secondArr) {
                    if (secondArr.hasOwnProperty(attrName)) {
                        options[attrName] = secondArr[attrName];
                    }
                }
                return options;
            },
            toElementsArray: function (elements) {
                // check if object is an array (or array like object)
                // Note: window object has .length property but it's not array of elements so don't consider it an array
                if (typeof elements !== "undefined" && (typeof elements.length !== "number" || elements === window)) {
                    elements = [elements];
                }
                return elements;
            }
        };
    })();


    // Class to maintain state of all registered events of a single type
    var EventsBucket = (function () {
        var EventsBucket = function () {
            // holds all the events

            this._eventsBucket = [];
            // function to be called while adding an event, the function should do the event initialization/registration
            this._beforeAdding = null;
            // function to be called while removing an event, the function should do the event destruction
            this._beforeRemoving = null;
        };

        EventsBucket.prototype.addEvent = function (target, selector, options, callback) {
            var newEvent = {
                target: target,
                selector: selector,
                options: options,
                callback: callback,
                firedElems: []
            };

            if (this._beforeAdding) {
                this._beforeAdding(newEvent);
            }

            this._eventsBucket.push(newEvent);
            return newEvent;
        };

        EventsBucket.prototype.removeEvent = function (compareFunction) {
            for (var i = this._eventsBucket.length - 1, registeredEvent; (registeredEvent = this._eventsBucket[i]); i--) {
                if (compareFunction(registeredEvent)) {
                    if (this._beforeRemoving) {
                        this._beforeRemoving(registeredEvent);
                    }

                    // mark callback as null so that even if an event mutation was already triggered it does not call callback
                    var removedEvents = this._eventsBucket.splice(i, 1);
                    if (removedEvents && removedEvents.length) {
                        removedEvents[0].callback = null;
                    }
                }
            }
        };

        EventsBucket.prototype.beforeAdding = function (beforeAdding) {
            this._beforeAdding = beforeAdding;
        };

        EventsBucket.prototype.beforeRemoving = function (beforeRemoving) {
            this._beforeRemoving = beforeRemoving;
        };

        return EventsBucket;
    })();


    /**
     * @constructor
     * General class for binding/unbinding arrive and leave events
     */
    var MutationEvents = function (getObserverConfig, onMutation) {
        var eventsBucket = new EventsBucket(),
            me = this;

        var defaultOptions = {
            fireOnAttributesModification: false
        };

        // actual event registration before adding it to bucket
        eventsBucket.beforeAdding(function (registrationData) {
            var
                target = registrationData.target,
                observer;

            // mutation observer does not work on window or document
            if (target === window.document || target === window) {
                target = document.getElementsByTagName("html")[0];
            }

            // Create an observer instance
            observer = new MutationObserver(function (e) {
                onMutation.call(this, e, registrationData);
            });

            var config = getObserverConfig(registrationData.options);

            observer.observe(target, config);

            registrationData.observer = observer;
            registrationData.me = me;
        });

        // cleanup/unregister before removing an event
        eventsBucket.beforeRemoving(function (eventData) {
            eventData.observer.disconnect();
        });

        this.bindEvent = function (selector, options, callback) {
            options = utils.mergeArrays(defaultOptions, options);

            var elements = utils.toElementsArray(this);

            for (var i = 0; i < elements.length; i++) {
                eventsBucket.addEvent(elements[i], selector, options, callback);
            }
        };

        this.unbindEvent = function () {
            var elements = utils.toElementsArray(this);
            eventsBucket.removeEvent(function (eventObj) {
                for (var i = 0; i < elements.length; i++) {
                    if (this === undefined || eventObj.target === elements[i]) {
                        return true;
                    }
                }
                return false;
            });
        };

        this.unbindEventWithSelectorOrCallback = function (selector) {
            var elements = utils.toElementsArray(this),
                callback = selector,
                compareFunction;

            if (typeof selector === "function") {
                compareFunction = function (eventObj) {
                    for (var i = 0; i < elements.length; i++) {
                        if ((this === undefined || eventObj.target === elements[i]) && eventObj.callback === callback) {
                            return true;
                        }
                    }
                    return false;
                };
            }
            else {
                compareFunction = function (eventObj) {
                    for (var i = 0; i < elements.length; i++) {
                        if ((this === undefined || eventObj.target === elements[i]) && eventObj.selector === selector) {
                            return true;
                        }
                    }
                    return false;
                };
            }
            eventsBucket.removeEvent(compareFunction);
        };

        this.unbindEventWithSelectorAndCallback = function (selector, callback) {
            var elements = utils.toElementsArray(this);
            eventsBucket.removeEvent(function (eventObj) {
                for (var i = 0; i < elements.length; i++) {
                    if ((this === undefined || eventObj.target === elements[i]) && eventObj.selector === selector && eventObj.callback === callback) {
                        return true;
                    }
                }
                return false;
            });
        };

        return this;
    };


    /**
     * @constructor
     * Processes 'arrive' events
     */
    var ArriveEvents = function () {
        // Default options for 'arrive' event
        var arriveDefaultOptions = {
            fireOnAttributesModification: false,
            onceOnly: false,
            existing: false
        };

        function getArriveObserverConfig(options) {
            var config = {
                attributes: false,
                childList: true,
                subtree: true
            };

            if (options.fireOnAttributesModification) {
                config.attributes = true;
            }

            return config;
        }

        function onArriveMutation(mutations, registrationData) {
            mutations.forEach(function (mutation) {
                var newNodes = mutation.addedNodes,
                    targetNode = mutation.target,
                    callbacksToBeCalled = [],
                    node;

                // If new nodes are added
                if (newNodes !== null && newNodes.length > 0) {
                    utils.checkChildNodesRecursively(newNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
                }
                else if (mutation.type === "attributes") {
                    if (nodeMatchFunc(targetNode, registrationData, callbacksToBeCalled)) {
                        callbacksToBeCalled.push({ callback: registrationData.callback, elem: targetNode });
                    }
                }

                utils.callCallbacks(callbacksToBeCalled, registrationData);
            });
        }

        function nodeMatchFunc(node, registrationData, callbacksToBeCalled) {
            // check a single node to see if it matches the selector
            if (utils.matchesSelector(node, registrationData.selector)) {
                if (node._id === undefined) {
                    node._id = arriveUniqueId++;
                }
                // make sure the arrive event is not already fired for the element
                if (registrationData.firedElems.indexOf(node._id) == -1) {
                    registrationData.firedElems.push(node._id);

                    return true;
                }
            }

            return false;
        }

        arriveEvents = new MutationEvents(getArriveObserverConfig, onArriveMutation);

        var mutationBindEvent = arriveEvents.bindEvent;

        // override bindEvent function
        arriveEvents.bindEvent = function (selector, options, callback) {

            if (typeof callback === "undefined") {
                callback = options;
                options = arriveDefaultOptions;
            } else {
                options = utils.mergeArrays(arriveDefaultOptions, options);
            }

            var elements = utils.toElementsArray(this);

            if (options.existing) {
                var existing = [];

                for (var i = 0; i < elements.length; i++) {
                    var nodes = elements[i].querySelectorAll(selector);
                    for (var j = 0; j < nodes.length; j++) {
                        existing.push({ callback: callback, elem: nodes[j] });
                    }
                }

                // no need to bind event if the callback has to be fired only once and we have already found the element
                if (options.onceOnly && existing.length) {
                    return callback.call(existing[0].elem, existing[0].elem);
                }

                setTimeout(utils.callCallbacks, 1, existing);
            }

            mutationBindEvent.call(this, selector, options, callback);
        };

        return arriveEvents;
    };


    /**
     * @constructor
     * Processes 'leave' events
     */
    var LeaveEvents = function () {
        // Default options for 'leave' event
        var leaveDefaultOptions = {};

        function getLeaveObserverConfig() {
            var config = {
                childList: true,
                subtree: true
            };

            return config;
        }

        function onLeaveMutation(mutations, registrationData) {
            mutations.forEach(function (mutation) {
                var removedNodes = mutation.removedNodes,
                    callbacksToBeCalled = [];

                if (removedNodes !== null && removedNodes.length > 0) {
                    utils.checkChildNodesRecursively(removedNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
                }

                utils.callCallbacks(callbacksToBeCalled, registrationData);
            });
        }

        function nodeMatchFunc(node, registrationData) {
            return utils.matchesSelector(node, registrationData.selector);
        }

        leaveEvents = new MutationEvents(getLeaveObserverConfig, onLeaveMutation);

        var mutationBindEvent = leaveEvents.bindEvent;

        // override bindEvent function
        leaveEvents.bindEvent = function (selector, options, callback) {

            if (typeof callback === "undefined") {
                callback = options;
                options = leaveDefaultOptions;
            } else {
                options = utils.mergeArrays(leaveDefaultOptions, options);
            }

            mutationBindEvent.call(this, selector, options, callback);
        };

        return leaveEvents;
    };


    var arriveEvents = new ArriveEvents(),
        leaveEvents = new LeaveEvents();

    function exposeUnbindApi(eventObj, exposeTo, funcName) {
        // expose unbind function with function overriding
        utils.addMethod(exposeTo, funcName, eventObj.unbindEvent);
        utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorOrCallback);
        utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorAndCallback);
    }

    /*** expose APIs ***/
    function exposeApi(exposeTo) {
        exposeTo.arrive = arriveEvents.bindEvent;
        exposeUnbindApi(arriveEvents, exposeTo, "unbindArrive");

        exposeTo.leave = leaveEvents.bindEvent;
        exposeUnbindApi(leaveEvents, exposeTo, "unbindLeave");
    }

    if ($) {
        exposeApi($.fn);
    }
    exposeApi(HTMLElement.prototype);
    exposeApi(NodeList.prototype);
    exposeApi(HTMLCollection.prototype);
    exposeApi(HTMLDocument.prototype);
    exposeApi(Window.prototype);

    var Arrive = {};
    // expose functions to unbind all arrive/leave events
    exposeUnbindApi(arriveEvents, Arrive, "unbindAllArrive");
    exposeUnbindApi(leaveEvents, Arrive, "unbindAllLeave");

    return Arrive;

})(window, typeof jQuery === 'undefined' ? null : jQuery, undefined);