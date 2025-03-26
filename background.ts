let active: boolean;
let replaceTab: boolean;
let allowCollector: boolean;
type tab = { id: string };

// -------------------------------------- TOGGLES ----------------------------------------

chrome.storage.local.get("allowCollector", (data: { allowCollector: boolean | undefined }) => {
  if (data.allowCollector !== undefined) {
    // si es undefined no es lo mismo que true y false en este caso
    allowCollector = data.allowCollector;
    return;
  }
  allowCollector = false;
});

chrome.storage.local.get("active", (data: { active: boolean | undefined }) => {
  if (data.active !== undefined) {
    // si es undefined no es lo mismo que true y false en este caso
    active = data.active;
    return;
  }
  active = true;
});

chrome.storage.local.get("replaceTab", (data: { replaceTab: boolean | undefined }) => {
  if (data.replaceTab !== undefined) {
    // si es undefined no es lo mismo que true y false en este caso
    replaceTab = data.replaceTab;
    return;
  }
  replaceTab = false;
});

// ---------------------------------- STRATEGIES ----------------------------------------

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function replaceTabStrategy(imageUrl: string, sender: any): Promise<string> {
  const idOfTabToReplace = sender.tab.id;
  await chrome.tabs.update(idOfTabToReplace, { url: imageUrl });
  return idOfTabToReplace;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function keepBothTabsStrategy(imageUrl: string, sender: any): Promise<string> {
  return new Promise((resolve) => {
    chrome.tabs.create(
      {
        url: imageUrl,
        active: false,
        // in this way, the tab is opened just after the sender tab, instead of it being the last tab always
        index: sender.tab.index + 1,
        openerTabId: sender.tab.id,
      },
      (tab: tab) => {
        resolve(tab.id);
      }
    );
  });
}

// -------------------------------------------- SPA PREVENTION ---------------------------------------------

function listenForChange() {
  chrome.tabs.onUpdated.addListener(
    (
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      tabId: any,
      changeInfo: {
        status: string;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        url: any;
      },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      tab: any
    ) => {
      // observes when the image holder tab is updated, because it may be an URL change (in SPA cases)
      console.log(changeInfo.status);
      if (changeInfo.status === "complete") {
        chrome.tabs.sendMessage(
          tabId,
          {
            message: "possibleUrlChange",
            url: changeInfo.url,
          },
          handleResponse
        );
      }
    }
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function handleResponse(response: any) {
  if (chrome.runtime.lastError) {
  }
}

// ------------------------------------------- COLLECTOR --------------------------------------------

function callDepositOnMasonry() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: tab[]) => {
    const currentTab = tabs[0]; // The current active tab in the window
    if (currentTab?.id) {
      chrome.tabs.sendMessage(currentTab.id, { message: "depositFromBg" }, handleResponse);
    } else {
      console.error("No active tab found.");
    }
  });
}

function placeCollectorButton() {
  const src = window.location.href;
  const button = document.createElement("button");

  button.textContent = "Collect";

  button.id = "collectorButton";
  button.style.backgroundColor = "black";
  button.style.color = "white";
  button.style.position = "absolute";
  button.style.bottom = "0px";
  button.style.left = "0px";

  button.addEventListener("click", () => {
    chrome.storage.local.get("collectedUrls", (data: { collectedUrls: string }) => {
      let newUrls = src;

      newUrls = `${data.collectedUrls} ${src}`;
      chrome.storage.local.set({ collectedUrls: newUrls }, () => {
        console.log("Updated URLs:", newUrls);
      });
    });
  });

  document.body.appendChild(button);
}

function callPlaceCollectorButton(tabId: string) {
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId },
      func: placeCollectorButton, // Pass the function reference directly
    });
  }, 500); // Wait 2 seconds before injecting
}

// ---------------------------------------- MESSAGING ---------------------------------------------

//message listener
chrome.runtime.onMessage.addListener(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async (request: any, sender: any, sendResponse: any) => {
    // create new tab with img message
    if (request.create && active) {
      const imageUrl = request.create;
      let id: string;
      if (replaceTab) {
        id = await replaceTabStrategy(imageUrl, sender);
      } else {
        id = await keepBothTabsStrategy(imageUrl, sender);
      }
      if (allowCollector) callPlaceCollectorButton(id);
    }
    if (request.message === "toggleActive") {
      // call for toggling the extension off and on
      active = !active;
      chrome.storage.local.set({ active });
    }
    if (request.message === "toggleReplace") {
      // call for replacing current tab with popped image
      replaceTab = !replaceTab;
      chrome.storage.local.set({ replaceTab });
    }
    if (request.message === "toggleCollector") {
      // call for replacing current tab with popped image
      allowCollector = !allowCollector;
      chrome.storage.local.set({ allowCollector });
    }
    if (request.message === "deposit") {
      callDepositOnMasonry();
    }
  }
);

listenForChange();
