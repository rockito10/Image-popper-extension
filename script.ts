// declare const chrome: any;

// const textarea: HTMLTextAreaElement = document.getElementById(
//   "addTextarea"
// ) as HTMLTextAreaElement;

// const button: HTMLButtonElement = document.getElementById(
//   "addButton"
// ) as HTMLButtonElement;

// let keysOrClasses: string[] = [];
// button.addEventListener("click", (evt) => {
//   // evt.preventDefault();
//   const value = textarea.value;
//   keysOrClasses.push(value);
//   // alert(keysOrClasses);
//   textarea.value = "";
//   tabsPopping(keysOrClasses);
// });

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

declare const chrome: any;

const textarea: HTMLTextAreaElement = document.getElementById(
  "addTextarea"
) as HTMLTextAreaElement;

const button: HTMLButtonElement = document.getElementById(
  "addButton"
) as HTMLButtonElement;

button.addEventListener("click", async (evt) => {
  const value = textarea.value;
  textarea.value = "";
  const response = await chrome.runtime.sendMessage({ keyOrClass: value });
});



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
