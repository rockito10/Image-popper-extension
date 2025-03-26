async function handleImageOpening() {
  // handles getting the image, then sending it to background to open it in a new tab later
  checkAndSendImg();
  checkAndSendVid();
}

// using this to prevent the same image from being opened multiple times
// if the page has the same href, its not supposed to open two tabs, just one then sleep.
let lastHref = "";
chrome.runtime.onMessage.addListener(
  // biome-ignore lint/suspicious/noExplicitAny: <out of domain>
  async (request: { message: string }, sender: any, sendResponse: any) => {
    // checks if the URL has changed, then opens the image in a new tab

    const hasUrlChanged = lastHref !== window.location.href;
    if (request.message === "possibleUrlChange" && hasUrlChanged) {
      await handleImageOpening();
      const currentUrl = window.location.href;
      lastHref = currentUrl;
    }
  }
);





















async function checkAndSendImg() {
  chrome.storage.local.get("ids", async (data: { ids: string[] }) => {
    for (const value of data.ids) {
      //por cada uno, agarra cada id y comprueba si exista en document, si existe lo poppea
      const identifier = value;

      // caso con id
      let img = document.getElementById(identifier) as HTMLImageElement;

      if (img && img instanceof HTMLImageElement) {
        // puede ser un video, así que miro si es img
        img.click();
        setTimeout(await chrome.runtime.sendMessage({ create: img.src }), 3000);
        return;
      }

      // caso con clase
      img = document.getElementsByClassName(identifier)[0] as HTMLImageElement;
      if (img && img instanceof HTMLImageElement) {
        // puede ser un video, así que miro si es img
        img.click();
        setTimeout(await chrome.runtime.sendMessage({ create: img.src }), 3000);
        return;
      }
    }
    console.error("No image found for the specified class or ID");
  });
}

async function checkAndSendVid() {
  chrome.storage.local.get("ids", async (data: { ids: string[] }) => {
    for (const value of data.ids) {
      //por cada uno, agarra cada id y comprueba si exista en document, si existe lo poppea
      const identifier = value;

      // caso con id
      let vid = document.getElementById(identifier) as HTMLVideoElement;

      if (vid && vid instanceof HTMLVideoElement) {
        // puede ser un img, así que miro si es video
        await chrome.runtime.sendMessage({ create: vid.currentSrc });
        return;
      }

      // caso con clase
      vid = document.getElementsByClassName(identifier)[0] as HTMLVideoElement;
      if (vid && vid instanceof HTMLVideoElement) {
        // puede ser un img, así que miro si es video
        await chrome.runtime.sendMessage({ create: vid.currentSrc });
        return;
      }
    }
    console.error("No video found for the specified class or ID");
  });
}
