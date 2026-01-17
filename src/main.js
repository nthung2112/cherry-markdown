import "cherry-markdown/dist/cherry-markdown.css";
import Cherry from "cherry-markdown/dist/cherry-markdown.core";
import CherryMermaidPlugin from "cherry-markdown/dist/addons/cherry-code-block-mermaid-plugin";
import mermaid from "mermaid";

Cherry.usePlugin(CherryMermaidPlugin, {
  mermaid, // pass in mermaid object
  // mermaidAPI: mermaid.mermaidAPI, // Can also be passed in mermaid API
  // At the same time, you can configure mermaid's behavior here, please refer to the official mermaid document
  // theme: "neutral",
  sequence: { useMaxWidth: false, showSequenceNumbers: true },
});

import defaultMd from "./data.md?raw";
import "./style.css";

import { basicConfig } from "./config.js";

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
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
      callback: {
        afterInit: (text, html) => {
          document.getElementById("markdown").classList.add("cherry-view-only");
        },
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
    editor: {
      ...basicConfig.editor,
      ...defaultConfig.editor,
    },
    callback: {
      ...basicConfig.callback,
      ...defaultConfig.callback,
    },
  });

  window.cherryObj = new Cherry(config);
}

main();
