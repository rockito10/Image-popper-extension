"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
function handleImageOpening() {
  return __awaiter(this, void 0, void 0, function* () {
    // handles getting the image, then sending it to background to open it in a new tab later
    checkAndSendImg();
    checkAndSendVid();
  });
}
// using this to prevent the same image from being opened multiple times
// if the page has the same href, its not supposed to open two tabs, just one then sleep.
let lastHref = "";
chrome.runtime.onMessage.addListener(
  // biome-ignore lint/suspicious/noExplicitAny: <out of domain>
  (request, sender, sendResponse) =>
    __awaiter(void 0, void 0, void 0, function* () {
      // checks if the URL has changed, then opens the image in a new tab
      const hasUrlChanged = lastHref !== window.location.href;
      if (request.message === "possibleUrlChange" && hasUrlChanged) {
        yield handleImageOpening();
        const currentUrl = window.location.href;
        lastHref = currentUrl;
      }
    })
);
function checkAndSendImg() {
  return __awaiter(this, void 0, void 0, function* () {
    chrome.storage.local.get("ids", (data) =>
      __awaiter(this, void 0, void 0, function* () {
        for (const value of data.ids) {
          //por cada uno, agarra cada id y comprueba si exista en document, si existe lo poppea
          const identifier = value;
          // caso con id
          let img = document.getElementById(identifier);
          if (img && img instanceof HTMLImageElement) {
            // puede ser un video, así que miro si es img
            img.click();
            setTimeout(yield chrome.runtime.sendMessage({ create: img.src }), 3000);
            return;
          }
          // caso con clase
          img = document.getElementsByClassName(identifier)[0];
          if (img && img instanceof HTMLImageElement) {
            // puede ser un video, así que miro si es img
            img.click();
            setTimeout(yield chrome.runtime.sendMessage({ create: img.src }), 3000);
            return;
          }
        }
        console.error("No image found for the specified class or ID");
      })
    );
  });
}
function checkAndSendVid() {
  return __awaiter(this, void 0, void 0, function* () {
    chrome.storage.local.get("ids", (data) =>
      __awaiter(this, void 0, void 0, function* () {
        for (const value of data.ids) {
          //por cada uno, agarra cada id y comprueba si exista en document, si existe lo poppea
          const identifier = value;
          // caso con id
          let vid = document.getElementById(identifier);
          if (vid && vid instanceof HTMLVideoElement) {
            // puede ser un img, así que miro si es video
            yield chrome.runtime.sendMessage({ create: vid.currentSrc });
            return;
          }
          // caso con clase
          vid = document.getElementsByClassName(identifier)[0];
          if (vid && vid instanceof HTMLVideoElement) {
            // puede ser un img, así que miro si es video
            yield chrome.runtime.sendMessage({ create: vid.currentSrc });
            return;
          }
        }
        console.error("No video found for the specified class or ID");
      })
    );
  });
}
