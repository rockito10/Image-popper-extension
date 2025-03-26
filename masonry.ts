chrome.runtime.onMessage.addListener(
  // biome-ignore lint/suspicious/noExplicitAny: <out of domain>
  async (request: { message: string }, sender: any, sendResponse: any) => {
    if (request.message === "depositFromBg") {
      depositOnMasonry();
    }
  }
);

function depositOnMasonry() {
  chrome.storage.local.get("collectedUrls", async (data: { collectedUrls: string }) => {
    const masonryTextarea = document.getElementById("masonryTextarea") as HTMLTextAreaElement;
    if (!masonryTextarea) throw new Error("Masorny textarea not found. Is the current tab the Masorny page?");

    placeImages(masonryTextarea, data); // click button and place images

    chrome.storage.local.set({ collectedUrls: "" }); //reset collector
  });
}
function placeImages(masonryTextarea: HTMLTextAreaElement, data: { collectedUrls: string }) {
  masonryTextarea.value = data.collectedUrls;
  document.getElementById("masonryButton")?.click(); //here masonry handles the images
}
