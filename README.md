# Image-popper-extension

## About

Simple tool for popping images without having to do the annoying right clicking, in an extension format for Chrome.

## Features

- Toggle on and off.
- Replace tab with the image on the popup.
- Intergration with my Masonry project (https://github.com/rockito10/JS-Web-Masonry) (Collect and deposit):
        - With collector enabled, you will see buttons to collect your image when it pops.
        - Using the extension when you are targeting masonry page, click deposit to place them down.

## How to use
in manifest.json, in "content_scripts" add the page you want to pop out images from (example: "https://www.example.com/posts/*") to the first "matches".

Then you have to add the id of the image on the post page, you can find the id using f12, using selector and selecting the image (it will show up in the HTML).

Extra
-For general scripts to also use in pages you can add the page to the second "matches".
-For compatibility with masonry project (https://github.com/rockito10/JS-Web-Masonry), be sure to add reference to the ip you are hosting it on.

## Download

Go to releases and take the last one, download the .rar file and upload it to the Chrome extension page, having the dev mode on.
