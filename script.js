// ==UserScript==
// @name         chatgpt.js test
// @namespace    https://chatgptjs.org
// @version      2023.03.20
// @description  A userscript template to test latest chatgpt.js compatibility, uncached w/o using @require
// @author       chatgpt.js
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// ==/UserScript==

// Import chatgpt.js using ES5
var xhr = new XMLHttpRequest()
xhr.open('GET', 'https://raw.githubusercontent.com/chatgptjs/chatgpt.js/main/chatgpt.js')
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
