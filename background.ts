function handleImageTabCreation() {
  chrome.runtime.onMessage.addListener(function (
    request: any,
    sender: any,
    sendResponse: any
  ) {
    // create new tab with img message
    if (request.create) {
      const imageUrl = request.create;
      console.log(request);
      chrome.tabs.create({
        url: imageUrl,
        active: false,
        // in this way, the tab is opened just after the sender tab, instead of it being the last tab always
        index: sender.tab.index + 1,
        openerTabId: sender.tab.id,
      });
    }
  });
}

function observeTabUpdates() {
  chrome.tabs.onUpdated.addListener(function (
    tabId: any,
    changeInfo: {
      status: string;
      url: any;
    },
    tab: any
  ) {
    // observes when the image holder tab is updated, because it may be an URL change (in SPA cases)
    if (changeInfo.status == "complete") {
      chrome.tabs.sendMessage(
        tabId,
        {
          message: "possibleUrlChange",
          url: changeInfo.url,
        },
        handleResponse
      );
    }
  });
}

function handleResponse(response: any) {
  if (chrome.runtime.lastError) {
    console.log(
      "Error sending message to tab:",
      chrome.runtime.lastError.message
    );
  }
}

handleImageTabCreation();
observeTabUpdates();
