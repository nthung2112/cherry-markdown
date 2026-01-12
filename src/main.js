import "cherry-markdown/dist/cherry-markdown.css";
import Cherry from "cherry-markdown/dist/cherry-markdown";

import defaultMd from "./data.md?raw";

import { basicConfig } from "./config.js";

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  // Check if the protocol is either http: or https:
  return url.protocol === "http:" || url.protocol === "https:";
}

async function main() {
  const currentParams = new URLSearchParams(window.location.search);
  const link = currentParams.get("link");
  let markDownValue = defaultMd;
  let defaultConfig = {};

  const savedMd = localStorage.getItem("cherry-markdown");
  if (savedMd) {
    markDownValue = savedMd;
  }

  const isView = currentParams.get("view");
  if (isView === "true") {
    defaultConfig = {
      editor: {
        defaultModel: "previewOnly",
        keepDocumentScrollAfterInit: true,
      },
    };
  }

  if (link && isValidHttpUrl(link)) {
    try {
      const response = await fetch(link);
      markDownValue = await response.text();
    } catch (error) {
      console.error(error);
    }
  }

  const config = Object.assign({}, basicConfig, {
    value: markDownValue,
    ...defaultConfig,
  });

  window.cherryObj = new Cherry(config);
}

main();
