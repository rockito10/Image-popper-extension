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
// var bkg = chrome.extension.getBackgroundPage();
// bkg.console.log("foo");
let keysOrClasses: string[] = [];
chrome.runtime.onMessage.addListener(function (
  request: { keyOrClass: string },
  sender: any,
  sendResponse: any
) {
  // if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
  // request.keyOrClass

  keysOrClasses.push(request.keyOrClass);
  console.log({ request, keysOrClasses });
  // alert(keysOrClasses);
  // throw new Error(keysOrClasses[0]);
});

chrome.tabs.onUpdated.addListener(function (
  tabId: any,
  changeInfo: { url: any },
  tab: any
) {
  // read changeInfo data and do something with it
  // like send the new url to contentscripts.js
  // console.log(changeInfo);
  if (changeInfo.status == "complete") {
    // console.log();
    chrome.tabs.sendMessage(tabId, {
      message: "changeurl",
      url: changeInfo.url,
    });
  }
});
// }
// chrome.tabs.sendMessage(tabId, {
//   message: "hello!",
//   url: changeInfo.url,
// });
