// ==UserScript==
// @name         chatgpt.js test (es6)
// @namespace    https://chatgptjs.org
// @version      2023.03.20
// @description  A userscript template to test latest chatgpt.js compatibility, uncached w/o using @require
// @author       chatgpt.js
// @match        https://chat.openai.com/*
// @icon         https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon64.png
// @grant        none
// @license      MIT
// ==/UserScript==

// Import latest chatgpt.js using ES6
import('https://code.chatgptjs.org/chatgpt-latest.min.js')
    .then(module => { yourCode() })

// Insert your code
function yourCode() {
    chatgpt.printAllFunctions() // test-log to console all available functions 
    // your code here
}
