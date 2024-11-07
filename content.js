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
function handleImageOpening() {
    return __awaiter(this, void 0, void 0, function* () {
        // handles getting the image, then sending it to background to open it in a new tab later
        const img = document.getElementsByClassName("_28lPU")[0];
        if (img) {
            return yield checkAndSend(img);
        }
        console.error("No image found for the specified class or ID");
        const vid = document.getElementById("video");
        if (vid) {
            yield chrome.runtime.sendMessage({ create: vid.currentSrc });
            console.log(vid.currentSrc);
            return;
        }
        console.error("No video found for the specified class or ID");
    });
}
// using this to prevent the same image from being opened multiple times
// if the page has the same href, its not supposed to open two tabs, just one then sleep.
let lastHref = "";
chrome.runtime.onMessage.addListener(
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(request, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    // checks if the URL has changed, then opens the image in a new tab
    const hasUrlChanged = lastHref !== window.location.href;
    if (request.message === "possibleUrlChange" && hasUrlChanged) {
        yield handleImageOpening();
        const currentUrl = window.location.href;
        lastHref = currentUrl;
    }
}));
function checkAndSend(img) {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.runtime.sendMessage({ create: img.src });
        return;
    });
}
