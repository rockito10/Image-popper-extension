async function handleImageOpening() {
  // handles getting the image, then sending it to background to open it in a new tab later
  const img = document.getElementsByClassName("_28lPU")[0] as HTMLImageElement;

  if (img) {
    return await checkAndSend(img);
  }

  console.error("No image found for the specified class or ID");
  const vid = document.getElementById("video") as HTMLVideoElement;
  if (vid) {
    await chrome.runtime.sendMessage({ create: vid.currentSrc });
    console.log(vid.currentSrc);
    return;
  }
  console.error("No video found for the specified class or ID");
}
// using this to prevent the same image from being opened multiple times
// if the page has the same href, its not supposed to open two tabs, just one then sleep.
let lastHref = "";
chrome.runtime.onMessage.addListener(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

async function checkAndSend(img: HTMLImageElement) {
  await chrome.runtime.sendMessage({ create: img.src });
  return;
}
