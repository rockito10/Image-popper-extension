"use strict";
let active = true;
let deleteTab = false;
function handleImageTabCreation() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // create new tab with img message
        if (request.create && active) {
            const imageUrl = request.create;
            chrome.tabs.create({
                url: imageUrl,
                active: false,
                // in this way, the tab is opened just after the sender tab, instead of it being the last tab always
                index: sender.tab.index + 1,
                openerTabId: sender.tab.id,
            });
            if (deleteTab) {
                chrome.tabs.remove(sender.tab.id);
            }
        }
        if (request.message === "toggleActive") {
            // Query the currently active tab
            active = !active;
            chrome.storage.local.set({ active });
        }
        if (request.message === "toggleDelete") {
            // Query the currently active tab
            deleteTab = !deleteTab;
            chrome.storage.local.set({ deleteTab });
        }
    });
}
function observeTabUpdates() {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        // observes when the image holder tab is updated, because it may be an URL change (in SPA cases)
        if (changeInfo.status === "complete") {
            chrome.tabs.sendMessage(tabId, {
                message: "possibleUrlChange",
                url: changeInfo.url,
            }, handleResponse);
        }
    });
}
function handleResponse(response) {
    if (chrome.runtime.lastError) {
        // console.log(
        //   "Error sending message to tab:",
        //   chrome.runtime.lastError.message
        // );
    }
}
handleImageTabCreation();
observeTabUpdates();
