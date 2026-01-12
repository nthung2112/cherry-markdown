const customViewMode = Cherry.createMenuHook("ViewMode", {
  iconName: "question",
  onClick: (selection, type) => {
    // cherryObj.switchModel("previewOnly", true);
    // cherryObj.switchModel("editOnly", true);
    cherryObj.switchModel("edit&preview", true);
  },
});

/** @type {import('cherry-markdown/types/cherry.d.ts').CherryOptions} */
const basicConfig = {
  id: "markdown",
  locale: "en_US",
  externals: {
    echarts: window.echarts,
    katex: window.katex,
    MathJax: window.MathJax,
  },
  engine: {
    global: {
      htmlAttrWhiteList: "part|slot",
      flowSessionContext: false,
    },
    syntax: {
      link: {
        attrRender: (text, href) => {
          return ``;
        },
      },
      image: {
        videoWrapper: (link, type, defaultWrapper) => {
          return defaultWrapper;
        },
      },
      autoLink: {
        target: "",
        rel: "",
        enableShortLink: true,
        shortLinkLength: 20,
        attrRender: (text, href) => {
          return ``;
        },
      },
      codeBlock: {
        theme: "twilight",
        lineNumber: true,
        expandCode: true,
        copyCode: true,
        editCode: true,
        changeLang: true,
        wrapperRender: (lang, code, html) => {
          return `<div class="custom-codeblock-wrapper language-${lang}" data-tips="You can customize the outer container of the code block">${html}</div>`;
        },
        customRenderer: {
          // all: {
          //   render: (src, sign, cherryEngine, lang) => {
          //     return `<p class="my-render">lang:${lang};code:${src}</p>`;
          //   },
          // },
        },
      },
      table: {
        enableChart: true,
      },
      fontEmphasis: {
        allowWhitespace: false,
      },
      strikethrough: {
        needWhitespace: false,
      },
      mathBlock: {
        engine: "MathJax",
        src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js",
      },
      inlineMath: {
        engine: "MathJax",
      },
      emoji: {
        useUnicode: true,
        customResourceURL:
          "https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8",
        upperCase: false,
      },
      htmlBlock: {
        removeTrailingNewline: false,
      },
      panel: {
        enableJustify: true,
        enablePanel: true,
      },
      footnote: {
        refNumber: {
          appendClass: "ref-number",
          render: (refNum, refTitle) => `[${refNum}]`,
          clickRefNumberCallback: (event, refNum, refTitle, content) => {
            // console.log(refNum, refTitle, content);
          },
        },
        refList: {
          appendClass: "ref-list",
          title: {
            appendClass: "ref-list-title",
            render: () => "",
          },
          listItem: {
            appendClass: "ref-list-item",
            render: (refNum, refTitle, content, refNumberLinkRender) => {
              return `${refNumberLinkRender(refNum, refTitle)}${content}`;
            },
          },
        },
        bubbleCard: {
          appendClass: "bubble-card",
          render: (refNum, refTitle, content) => {
            return `
              <div class="cherry-ref-bubble-card__title">${refNum}. ${refTitle}</div>
              <div class="cherry-ref-bubble-card__content">${content}</div>
              <div class="cherry-ref-bubble-card__foot"></div>
            `;
          },
        },
      },
    },
  },
  multipleFileSelection: {
    video: true,
    audio: false,
    image: true,
    word: false,
    pdf: true,
    file: true,
  },
  toolbars: {
    toolbar: [
      "bold",
      "italic",
      {
        strikethrough: ["strikethrough", "underline", "sub", "sup"],
      },
      "size",
      "|",
      "color",
      "header",
      "|",
      "ol",
      "ul",
      "checklist",
      "panel",
      "align",
      "detail",
      "|",
      "formula",
      {
        insert: [
          "image",
          "audio",
          "video",
          "link",
          "hr",
          "br",
          "code",
          "inlineCode",
          "formula",
          "toc",
          "table",
          "pdf",
          "word",
          "file",
        ],
      },
      "graph",
      "proTable",
      "togglePreview",
      "customViewMode",
      "search",
      "shortcutKey",
    ],
    toolbarRight: ["fullScreen", "|", "export", "wordCount", "|", "switchModel"],
    bubble: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "sub",
      "sup",
      "quote",
      "|",
      "size",
      "color",
    ], // array or false
    sidebar: ["mobilePreview", "copy"],
    toc: {
      defaultModel: "full",
    },
    customMenu: {
      customViewMode,
    },
    shortcutKeySettings: {
      isReplace: false,
      shortcutKeyMap: {
        "Alt-Digit1": {
          hookName: "header",
          aliasName: "Header",
        },
        "Control-Shift-KeyX": {
          hookName: "bold",
          aliasName: "Bold",
        },
      },
    },
  },
  previewer: {
    floatWhenClosePreviewer: true,
  },
  keydown: [],
  callback: {
    onClickPreview: (event) => {
      console.log("onClickPreview", event);
    },
    afterAsyncRender: (md, html) => {
      localStorage.setItem("cherry-markdown", md);
    },
    urlProcessor(url, srcType) {
      console.log(`url-processor`, url, srcType);
      return url;
    },
  },
  editor: {
    id: "cherry-text",
    name: "cherry-text",
    autoSave2Textarea: true,
    defaultModel: "edit&preview",
    showFullWidthMark: true,
    showSuggestList: true,
    maxUrlLength: 200,
    codemirror: {
      placeholder: "Enter text or / to start editing",
    },
  },
  autoScrollByHashAfterInit: true,
  themeSettings: {
    mainTheme: "default",
  },
};

export { basicConfig };
