// keysOrClasses.forEach(async (keyOrClass) => {
//   const img = document.getElementsByClassName(
//     keyOrClass
//   )[0] as HTMLImageElement;
//   if (!img) {
//     const img = document.getElementById(keyOrClass) as HTMLImageElement;
//   }
//   // alert(img);
//   // const index = keysOrClasses.indexOf(keyOrClass);
//   // keysOrClasses.splice(index, 1);
//   window.open(img.src, "_blank");
//   console.log("Pepe");
//   await chrome.runtime.sendMessage({ daDog: "dog" });
//   throw new Error("pepe");
// });
// chrome.runtime.sendMessage({ daDog: "dog" });

// console.log("Pepe");
// throw new Error("pepe");
// const img = document.getElementsByClassName(
//   "_28lPU _1_vBa"
// )[0] as HTMLImageElement;
// if (!img) {
//   const img = document.getElementById("_28lPU _1_vBa") as HTMLImageElement;
// }
// window.open(img.src, "_blank");

// window.addEventListener("popstate", () => {
//   chrome.runtime.sendMessage({ daDog: "popstate" });
// });

// window.addEventListener("pushstate", () => {
//   chrome.runtime.sendMessage({ daDog: "pushstate" });
// });

// Function to handle image opening logic
function handleImageOpening() {
  const img = document.getElementsByClassName("_28lPU")[0] as HTMLImageElement;
  if (!img) {
    const img = document.getElementById("_28lPU") as HTMLImageElement;
  }
  if (img) {
    window.open(img.src, "_blank");
  } else {
    console.warn("No image found for the specified class or ID.");
  }
}

let lastHref = window.location.href;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "changeurl" && lastHref !== window.location.href) {
    handleImageOpening();
    lastHref = window.location.href;
  }
});
handleImageOpening();
