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
chrome.runtime.onMessage.addListener(
// biome-ignore lint/suspicious/noExplicitAny: <out of domain>
(request, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.message === "depositFromBg") {
        depositOnMasonry();
    }
}));
function depositOnMasonry() {
    chrome.storage.local.get("collectedUrls", (data) => __awaiter(this, void 0, void 0, function* () {
        const masonryTextarea = document.getElementById("masonryTextarea");
        if (!masonryTextarea)
            throw new Error("Masorny textarea not found. Is the current tab the Masorny page?");
        placeImages(masonryTextarea, data); // click button and place images
        chrome.storage.local.set({ collectedUrls: "" }); //reset collector
    }));
}
function placeImages(masonryTextarea, data) {
    var _a;
    masonryTextarea.value = data.collectedUrls;
    (_a = document.getElementById("masonryButton")) === null || _a === void 0 ? void 0 : _a.click(); //here masonry handles the images
}
