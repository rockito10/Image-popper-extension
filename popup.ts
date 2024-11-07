declare const chrome: any;
const extensionToggler = document.getElementById(
  "extensionToggler"
) as HTMLInputElement;
const deleteToggler = document.getElementById(
  "deleteToggler"
) as HTMLInputElement;

let active = true;
let deleteTab = false;

chrome.storage.local.get("active", (data) => {
  if (data.active !== undefined) {
    // si es undefined no es lo mismo que true y false en este caso
    active = data.active;
    extensionToggler.checked = active;
  }
});
chrome.storage.local.get("delete", (data) => {
  if (data.deleteTab !== undefined) {
    // si es undefined no es lo mismo que true y false en este caso
    deleteTab = data.deleteTab;
    extensionToggler.checked = deleteTab;
  }
});

extensionToggler.addEventListener("change", () => {
  chrome.runtime.sendMessage({ message: "toggleActive" });
  console.log(extensionToggler.checked);
});

deleteToggler.addEventListener("change", () => {
  chrome.runtime.sendMessage({ message: "toggleDelete" });
  console.log(extensionToggler.checked);
});
