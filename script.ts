declare const chrome: any;

document.getElementById("popButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: () => {
        const img = document.getElementsByClassName(
          "_3gZSt _3_nEn"
        )[0] as HTMLImageElement;
        // console.log(img);
        // alert(img.src);
        window.open(img.src, "_blank");
      },
    });
  });
});
