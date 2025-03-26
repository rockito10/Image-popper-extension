// biome-ignore lint/suspicious/noExplicitAny: <explanation>
declare const chrome: any;
const extensionToggler = document.getElementById("extensionToggler") as HTMLInputElement;
const replaceToggler = document.getElementById("replaceToggler") as HTMLInputElement;
const collectorToggler = document.getElementById("collectorToggler") as HTMLInputElement;
const addIdButton = document.getElementById("addIdButton") as HTMLButtonElement;
const delIdButton = document.getElementById("delIdButton") as HTMLButtonElement;

const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
const idsAndClasses = document.getElementById("idsAndClasses") as HTMLTextAreaElement;
const urlDepositButton = document.getElementById("urlDepositButton") as HTMLButtonElement;

//-------------------------------------------- TOGGLES -----------------------------------------------------

chrome.storage.local.get("active", (data: { active: boolean | undefined }) => {
  if (data.active !== undefined) {
    // si es undefined no es lo mismo que true y false en este caso
    extensionToggler.checked = data.active;
  } else {
    extensionToggler.checked = true;
  }
});

chrome.storage.local.get("replaceTab", (data: { replaceTab: boolean | undefined }) => {
  if (data.replaceTab !== undefined) {
    // si es undefined no es lo mismo que true y false en este caso
    replaceToggler.checked = data.replaceTab;
  } else {
    replaceToggler.checked = false;
  }
});

chrome.storage.local.get("allowCollector", (data: { allowCollector: boolean | undefined }) => {
  console.log(data.allowCollector);
  if (data.allowCollector !== undefined) {
    // si es undefined no es lo mismo que true y false en este caso
    collectorToggler.checked = data.allowCollector;
    checkVisibilityOfCollector();
  } else {
    collectorToggler.checked = false;
  }
});

collectorToggler.addEventListener("change", (evt) => {
  // activar / desactivar el collector de URLs
  checkVisibilityOfCollector();
  chrome.runtime.sendMessage({ message: "toggleCollector" });
});

function checkVisibilityOfCollector() {
  if (collectorToggler.checked) {
    urlDepositButton.style.visibility = "visible";
  } else {
    urlDepositButton.style.visibility = "hidden";
  }
}

extensionToggler.addEventListener("change", () => {
  // activar / desactivar extensión
  chrome.runtime.sendMessage({ message: "toggleActive" });
});

replaceToggler.addEventListener("change", () => {
  // pisar / no pisar pestaña poppeada
  chrome.runtime.sendMessage({ message: "toggleReplace" });
});

//-------------------------------------------- IDs -----------------------------------------------------

//seteo los ids y clases para que se vean
chrome.storage.local.get("ids", async (data: { ids: string[] }) => {
  loadTextareaShowcase(data);
});

addIdButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  chrome.storage.local.get("ids", async (data: { ids: string[] }) => {
    // lo que viene no es un set, es una lista (chrome no entiende sets)
    addId(data);
  });
});

function loadTextareaShowcase(data: { ids: string[] }) {
  let n = 0;
  for (const identifier of data.ids) {
    if (n === 0) {
      idsAndClasses.value += `| ${identifier}`; //si es el primero que no espacie
    } else {
      idsAndClasses.value += ` | ${identifier}`; //el resto que espacie
    }
    n++;
  }
}

function addId(data: { ids: string[] }) {
  let current_ids: Set<string>;
  // no hay nada? empiezo set
  if (data.ids === undefined) {
    current_ids = new Set();
  } else if (textarea.value !== "") {
    // pusheo lo nuevo si no es vacío
    current_ids = new Set(data.ids); //transformo a set
    const identifier = textarea.value.trim();
    current_ids.add(identifier);
    textarea.value = "";
  } else {
    // caso donde hayan apretado el botón porque sí
    return;
  }
  const newData = { ids: Array.from(current_ids) };
  //tengo que reconvertir a array porque no lo entiende chrome sino
  chrome.storage.local.set(newData);
  reloadTextareaShowcase(newData);
}

delIdButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  chrome.storage.local.get("ids", async (data: { ids: string[] }) => {
    // lo que viene no es un set, es una lista (chrome no entiende sets)
    deleteId(data);
  });
});

function deleteId(data: { ids: string[] }) {
  let current_ids: Set<string>;
  // no hay nada? empiezo set
  if (data.ids === undefined) {
    current_ids = new Set();
  } else if (textarea.value !== "") {
    // pusheo lo nuevo si no es vacío
    current_ids = new Set(data.ids); //transformo a set
    const identifier = textarea.value.trim();
    current_ids.delete(identifier);
    textarea.value = "";
  } else {
    // caso donde hayan apretado el botón porque sí
    return;
  }
  const newData = { ids: Array.from(current_ids) };
  //tengo que reconvertir a array porque no lo entiende chrome sino
  chrome.storage.local.set(newData);
  console.log(newData);
  reloadTextareaShowcase(newData);
}

function reloadTextareaShowcase(newData: { ids: string[] }) {
  idsAndClasses.value = "";
  loadTextareaShowcase(newData);
}

// ---------------------------------- COLLECTOR ----------------------------------

urlDepositButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  chrome.runtime.sendMessage({ message: "deposit" });
});

function handleCollectorClick(url: string) {
  chrome.storage.local.get("collectedUrls", async (data: { collectedUrls: string }) => {
    if (data.collectedUrls === "") {
      chrome.storage.local.set({ collectedUrls: url });
      return;
    }
    const newUrls = `${data.collectedUrls} ${url}`;
    chrome.storage.local.set({ collectedUrls: newUrls });
    console.log(newUrls);
  });
}

//-------------------------------------------- MESSAGING -----------------------------------------------------

chrome.runtime.onMessage.addListener(
  // biome-ignore lint/suspicious/noExplicitAny: <out of domain>
  async (request: { message: string; src: string }, sender: any, sendResponse: any) => {
    if (request.message === "collectorButtonClicked") {
      handleCollectorClick(request.src);
    }
  }
);
