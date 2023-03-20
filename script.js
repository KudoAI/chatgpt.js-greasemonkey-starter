// ==UserScript==
// @name chatgpt-hello
// @namespace https://chatgptjs.org
// @version 0.0.1
// @description A template for a chatgpt userscript use chatgptjs
// @author chatgptjs
// @match https://chat.openai.com/*
// @grant none
// @license MIT
// ==/UserScript==

(function() {
'use strict';
    initialize();
})();

async function initialize() {
    while(!window.chatgpt) {await new Promise(r => setTimeout(r, 1000));}
    chatgpt.send("hello!");
}

(function() {

    /*
     *  The code in this function was adapted from the chatgptjs/chatgpt.js library, authored by Adam Lui and 冯不游
     *  (https://chatgptjs.org) and licensed under the MIT License.
    */

    var chatgpt = {

        clearChats: function() {
            var clearLabels = ['Clear conversations', 'Confirm clear conversations'];
            if (!this.clearChats.cnt) this.clearChats.cnt = 0;
            if (this.clearChats.cnt >= clearLabels.length) return; // exit if already confirmed
            for (var navLink of document.querySelectorAll('nav > a')) {
                if (navLink.text.includes(clearLabels[this.clearChats.cnt])) {
                    navLink.click(); this.clearChats.cnt++;
                    setTimeout(this.clearChats.bind(this), 500); return; // repeat to confirm
                }
            }
        },

        getChatInput: function() {
            return document.querySelector('form textarea').value;
        },

        getNewChatButton: function() {
            for (var navLink of document.querySelectorAll('nav > a')) {
                if (navLink.text.includes('New chat')) {
                    return navLink;
                }
            }
        },

        getRegenerateButton: function() {
            var form = document.querySelector('form');
            var buttons = form.querySelectorAll('button');
            var result = Array.from(buttons).find(button => button.textContent.trim().toLowerCase().includes('regenerate'));
            return result;
        },

        getSendButton: function() {
            return document.querySelector('form button[class*="bottom"]');
        },

        getStopGeneratingButton: function() {
            var form = document.querySelector('form');
            var buttons = form.querySelectorAll('button');
            return Array.from(buttons).find(button => button.textContent.trim().toLowerCase().includes('stop generating'));
        },

        getTextarea: function() {
            var form = document.querySelector('form');
            var textareas = form.querySelectorAll('textarea');
            var result = textareas[0];
            return result;
        },

        getLastResponseElement: function() {
            var responseElements = document.querySelectorAll('.group.w-full');
            return responseElements[responseElements.length - 1];
        },

        getLastResponse: function() {
            var lastResponseElement = this.getLastResponseElement();
            if (!lastResponseElement) return;
            var lastResponse = lastResponseElement.textContent;
            return lastResponse;
        },

        send: function(msg) {
            var textarea = this.getTextarea();
            textarea.value = msg;
            var sendButton = this.getSendButton();
            sendButton && sendButton.click();
        },

        stop: function() {
            var stopGeneratingButton = this.getStopGeneratingButton();
            stopGeneratingButton && stopGeneratingButton.click();
        },

        regenerate: function() {
            var regenerateButton = this.getRegenerateButton();
            regenerateButton && regenerateButton.click();
        },

        new: function() {
            var newChatButton = this.getNewChatButton();
            newChatButton && newChatButton.click();
        },

        sendInNewChat: function(msg) {
            this.new();
            setTimeout(() => {
                this.send(msg);
            }, 500);
        },

        notify: function(msg, position = '') {
            var vOffset = 13, hOffset = 27; // px offset from viewport border
            var notificationDuration = 1.75; // sec duration to maintain notification visibility
            var fadeDuration = 0.6; // sec duration of fade-out

            // Find or make div
            var notificationDiv = document.querySelector('#notification-alert');
            if (!notificationDiv) { // if missing
                notificationDiv = document.createElement('div'); // make div
                notificationDiv.id = 'notification-alert';
                notificationDiv.style.cssText = ( // stylize it
                    '/* Box style */   background-color: black ; padding: 10px ; border-radius: 8px ; '
                    + '/* Visibility */  opacity: 0 ; position: fixed ; z-index: 9999 ; font-size: 1.8rem ; color: white');
                document.body.appendChild(notificationDiv); // insert into DOM
            }

            // Position notification (defaults to top-right)
            notificationDiv.style.top = !/low|bottom/i.test(position) ? `${vOffset}px` : '';
            notificationDiv.style.bottom = /low|bottom/i.test(position) ? `${vOffset}px` : '';
            notificationDiv.style.right = !/left/i.test(position) ? `${hOffset}px` : '';
            notificationDiv.style.left = /left/i.test(position) ? `${hOffset}px` : '';

            // Show notification
            if (this.notify.isDisplaying) clearTimeout(this.notify.hideTimer); // clear previous hide
            notificationDiv.innerHTML = msg; // insert msg
            notificationDiv.style.transition = 'none'; // remove fade effect
            notificationDiv.style.opacity = 1; // show msg
            this.notify.isDisplaying = true;

            // Hide notification
            var hideDelay = ( // set delay before fading
                fadeDuration > notificationDuration ? 0 // don't delay if fade exceeds notification duration
                : notificationDuration - fadeDuration); // otherwise delay for difference
            this.notify.hideTimer = setTimeout(function hideNotif() { // maintain notification visibility, then fade out
                notificationDiv.style.transition = `opacity ${fadeDuration}s`; // add fade effect
                notificationDiv.style.opacity = 0; // hide notification...
                this.notify.isDisplaying = false;
            }, hideDelay * 1000); // ...after pre-set duration
        },

        startNewChat: function() {
            for (var link of document.getElementsByTagName('a')) {
                if (link.text.includes('New chat')) {
                    link.click(); break;
                }
            }
        },

        isIdle: true,
        isGenerating: false,
        status: 'idle',
        prevStatus: 'idle',

        updateStatus: function() {
            var stopGeneratingButton = this.getStopGeneratingButton();

            if (stopGeneratingButton) {
                this.isIdle = false;
                this.isGenerating = true;
                this.status = 'generating';
            } else if (!stopGeneratingButton) {
                this.isIdle = true;
                this.isGenerating = false;
                this.status = 'idle';
            }
            if (this.status !== this.prevStatus) {
                this.toggleStatus();
            }
        },

        toggleStatus: function() {
            this.prevStatus = this.status;
            if (this.status === 'idle') {
                this.eventEmitter.emit('onIdle');
            } else if (this.status === 'generating') {
                this.eventEmitter.emit('onGenerating');
            }
        },

        eventEmitter: {
            events: {},

            on: function(eventName, callback) {
                if (!this.events[eventName]) {
                    this.events[eventName] = [];
                }
                this.events[eventName].push(callback);
            },

            once: function(eventName, callback) {
                var self = this;
                function oneTimeCallback() {
                    callback.apply(null, arguments);
                    self.removeListener(eventName, oneTimeCallback);
                }
                this.on(eventName, oneTimeCallback);
            },

            removeListener: function(eventName, callback) {
                if (this.events[eventName]) {
                    this.events[eventName] = this.events[eventName].filter(function(cb) {
                        return cb !== callback;
                    });
                }
            },

            emit: function(eventName) {
                if (this.events[eventName]) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    this.events[eventName].forEach(function(callback) {
                        callback.apply(null, args);
                    });
                }
            }
        }
    };

    // Create alias functions
    var aliases = [ // synonyms within function names
        ['chat', 'conversation', 'convo'],
        ['send', 'submit']
    ];
    var reAliases = new RegExp(aliases.flat().join('|'), 'gi');
    for (var prop in chatgpt) {
        if (typeof chatgpt[prop] === 'function') {
            for (var match of prop.matchAll(reAliases)) {
                var originalWord = match[0].toLowerCase();
                var aliasValues = [].concat(...aliases // flatten into single array w/ match's aliases
                    .filter(arr => arr.includes(originalWord)) // filter in relevant alias sub-arrays
                    .map(arr => arr.filter(word => word !== originalWord))); // filter out match word
                var matchCase = /^[A-Z][a-z]+$/.test(match[0]) ? 'title'
                    : /^[a-z]+$/.test(match[0]) ? 'lower'
                    : /^[A-Z]+$/.test(match[0]) ? 'upper' : 'mixed';
                for (var alias of aliasValues) { // make alias functions
                    alias = ( // preserve camel case for new name
                        matchCase === 'title' ? alias.charAt(0).toUpperCase() + alias.slice(1).toLowerCase()
                        : matchCase === 'upper' ? alias.toUpperCase()
                        : matchCase === 'lower' ? alias.toLowerCase() : alias);
                    var aliasProp = prop.replace(match[0], alias); // name new function
                    chatgpt[aliasProp] = chatgpt[prop]; // reference original function
                }
            }
        }
    }

    try { window.chatgpt = chatgpt; } catch (error) { /* for Greasemonkey */ }
    try { module.exports = chatgpt; } catch (error) { /* for CommonJS */ }

    // Use the added functions to get the elements
    var sendButton = chatgpt.getSendButton();
    var textarea = chatgpt.getTextarea();
    var regenerateButton = chatgpt.getRegenerateButton();
    var stopGeneratingButton = chatgpt.getStopGeneratingButton();
    var newChatButton = chatgpt.getNewChatButton();

    // Check the status
    setInterval(function() {
        chatgpt.updateStatus();
    }, 1000);

    sendButton && sendButton.addEventListener('click', function() {
        chatgpt.updateStatus();
    });

    // Listener examples
    chatgpt.eventEmitter.on('onIdle', function() {
        console.log('Chat is idle');
    });
    chatgpt.eventEmitter.on('onGenerating', function() {
        console.log('Chat is generating');
    });

    // Pre-assign IDs to the elements
    sendButton && (sendButton.id = 'chatgpt-submit-button');
    textarea && (textarea.id = 'chatgpt-textarea');
    regenerateButton && (regenerateButton.id = 'chatgpt-regenerate-button');
    stopGeneratingButton && (stopGeneratingButton.id = 'chatgpt-stop-generating-button');
    newChatButton && (newChatButton.id = 'chatgpt-new-chat-button');
    
})();
