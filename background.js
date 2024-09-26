"use strict";
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   // if (message.type === "modifyBackground") {
//   //   // Perform the desired modification
//   //   console.log("Background script received message:", message.data);
//   //   // Perform your desired background modification here
//   //   parseInt("pepe");
//   //   // Send a response back to the popup script
//   sendResponse({ status: "success", data: "Background modified" });
//   alert("pepe");
// });
let keysOrClasses = [];
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
    // request.keyOrClass
    keysOrClasses.push(request.keyOrClass);
    // alert(keysOrClasses);
    throw new Error(keysOrClasses[0]);
});
