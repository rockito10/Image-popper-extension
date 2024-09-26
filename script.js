"use strict";
// declare const chrome: any;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const textarea = document.getElementById("addTextarea");
const button = document.getElementById("addButton");
button.addEventListener("click", (evt) => __awaiter(void 0, void 0, void 0, function* () {
    const value = textarea.value;
    textarea.value = "";
    const response = yield chrome.runtime.sendMessage({ keyOrClass: value });
}));
// function tabsPopping(keysOrClasses: string[]) {
//   // alert("pepe");
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
//     const activeTab = tabs[0];
//     chrome.scripting.executeScript({
//       target: { tabId: activeTab.id },
//       func: (keysOrClasses: string[]) => {
//         keysOrClasses.forEach((keyOrClass) => {
//           const img = document.getElementsByClassName(
//             keyOrClass
//           )[0] as HTMLImageElement;
//           if (!img) {
//             const img = document.getElementById(keyOrClass) as HTMLImageElement;
//           }
//           // alert(img);
//           // const index = keysOrClasses.indexOf(keyOrClass);
//           // keysOrClasses.splice(index, 1);
//           window.open(img.src, "_blank");
//         });
//       },
//       args: [keysOrClasses],
//     });
//   });
// }
// setInterval(() => {
//   tabsPopping(keysOrClasses);
// }, 1000);
