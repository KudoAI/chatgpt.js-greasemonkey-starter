// ==UserScript==
// @name         chatgpt.js test
// @namespace    https://chatgptjs.org
// @version      2023.03.20
// @description  A template to test latest chatgpt.js compatibility (uncached by avoiding @require)
// @author       chatgpt.js
// @match        https://chat.openai.com/*
// @icon         https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon64.png
// @grant        none
// @license      MIT
// ==/UserScript==

// Import latest chatgpt.js (via ES5/XHR to avoid CORS)
var xhr = new XMLHttpRequest()
xhr.open('GET', 'https://code.chatgptjs.org/chatgpt-latest.js')
xhr.onload = function() {
    if (xhr.status === 200) {
        var chatgptJS = document.createElement('script')
        chatgptJS.textContent = xhr.responseText
        document.head.appendChild(chatgptJS)
        yourCode() // run your code
    }
}
xhr.send()

// Insert your code
function yourCode() {
    chatgpt.printAllFunctions(); // test log all functions available in console
    // your code here
}
