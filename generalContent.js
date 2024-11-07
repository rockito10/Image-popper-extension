"use strict";
const removeTag = "";
setInterval(() => {
  Array.from(document.getElementsByClassName(removeTag)).forEach((img) => {
    img.classList.remove(removeTag);
  }, 2000);
});
