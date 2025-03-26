"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let active;
let replaceTab;
let allowCollector;
// -------------------------------------- TOGGLES ----------------------------------------
chrome.storage.local.get("allowCollector", (data) => {
    if (data.allowCollector !== undefined) {
        // si es undefined no es lo mismo que true y false en este caso
        allowCollector = data.allowCollector;
        return;
    }
    allowCollector = false;
});
chrome.storage.local.get("active", (data) => {
    if (data.active !== undefined) {
        // si es undefined no es lo mismo que true y false en este caso
        active = data.active;
        return;
    }
    active = true;
});
chrome.storage.local.get("replaceTab", (data) => {
    if (data.replaceTab !== undefined) {
        // si es undefined no es lo mismo que true y false en este caso
        replaceTab = data.replaceTab;
        return;
    }
    replaceTab = false;
});
// ---------------------------------- STRATEGIES ----------------------------------------
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function replaceTabStrategy(imageUrl, sender) {
    return __awaiter(this, void 0, void 0, function* () {
        const idOfTabToReplace = sender.tab.id;
        yield chrome.tabs.update(idOfTabToReplace, { url: imageUrl });
        return idOfTabToReplace;
    });
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function keepBothTabsStrategy(imageUrl, sender) {
    return new Promise((resolve) => {
        chrome.tabs.create({
            url: imageUrl,
            active: false,
            // in this way, the tab is opened just after the sender tab, instead of it being the last tab always
            index: sender.tab.index + 1,
            openerTabId: sender.tab.id,
        }, (tab) => {
            resolve(tab.id);
        });
    });
}
// -------------------------------------------- SPA PREVENTION ---------------------------------------------
function listenForChange() {
    chrome.tabs.onUpdated.addListener((
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    tabId, changeInfo, 
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    tab) => {
        // observes when the image holder tab is updated, because it may be an URL change (in SPA cases)
        console.log(changeInfo.status);
        if (changeInfo.status === "complete") {
            chrome.tabs.sendMessage(tabId, {
                message: "possibleUrlChange",
                url: changeInfo.url,
            }, handleResponse);
        }
    });
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function handleResponse(response) {
    if (chrome.runtime.lastError) {
    }
}
// ------------------------------------------- COLLECTOR --------------------------------------------
function callDepositOnMasonry() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0]; // The current active tab in the window
        if (currentTab === null || currentTab === void 0 ? void 0 : currentTab.id) {
            chrome.tabs.sendMessage(currentTab.id, { message: "depositFromBg" }, handleResponse);
        }
        else {
            console.error("No active tab found.");
        }
    });
}
function placeCollectorButton() {
    const src = window.location.href;
    const button = document.createElement("button");
    button.textContent = "Collect";
    button.id = "collectorButton";
    button.style.backgroundColor = "black";
    button.style.color = "white";
    button.style.position = "absolute";
    button.style.bottom = "0px";
    button.style.left = "0px";
    button.addEventListener("click", () => {
        chrome.storage.local.get("collectedUrls", (data) => {
            let newUrls = src;
            newUrls = `${data.collectedUrls} ${src}`;
            chrome.storage.local.set({ collectedUrls: newUrls }, () => {
                console.log("Updated URLs:", newUrls);
            });
        });
    });
    document.body.appendChild(button);
}
function callPlaceCollectorButton(tabId) {
    setTimeout(() => {
        chrome.scripting.executeScript({
            target: { tabId },
            func: placeCollectorButton, // Pass the function reference directly
        });
    }, 500); // Wait 2 seconds before injecting
}
// ---------------------------------------- MESSAGING ---------------------------------------------
//message listener
chrome.runtime.onMessage.addListener(
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(request, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    // create new tab with img message
    if (request.create && active) {
        const imageUrl = request.create;
        let id;
        if (replaceTab) {
            id = yield replaceTabStrategy(imageUrl, sender);
        }
        else {
            id = yield keepBothTabsStrategy(imageUrl, sender);
        }
        if (allowCollector)
            callPlaceCollectorButton(id);
    }
    if (request.message === "toggleActive") {
        // call for toggling the extension off and on
        active = !active;
        chrome.storage.local.set({ active });
    }
    if (request.message === "toggleReplace") {
        // call for replacing current tab with popped image
        replaceTab = !replaceTab;
        chrome.storage.local.set({ replaceTab });
    }
    if (request.message === "toggleCollector") {
        // call for replacing current tab with popped image
        allowCollector = !allowCollector;
        chrome.storage.local.set({ allowCollector });
    }
    if (request.message === "deposit") {
        callDepositOnMasonry();
    }
}));
listenForChange();
