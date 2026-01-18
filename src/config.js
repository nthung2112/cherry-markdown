import { addDiagramTool } from "./diagram";

/*
{
  subMenuConfig: Array,
  onClick: 'function',
  shortcutKeys: Array,
  iconName: 'string',
  icon: [
    'string',
    {
      type: 'string',
      content: 'string',
      iconStyle: ['string', 'undefined'],
      iconClassName: ['string', 'undefined'],
    },
  ],
};
*/
const customViewDesktop = Cherry.createMenuHook("ViewDesktop", {
  iconName: "question",
  onClick: (selection, type) => {
    const preview = cherryObj.getPreviewer();
    const previewerDom = preview.options.previewerDom;
    preview.isMobilePreview = false;
    if (!preview.isDesktopPreview) {
      preview.isDesktopPreview = true;
      previewerDom.innerHTML = `<div class='cherry-desktop-previewer-content'>${previewerDom.innerHTML}</div>`;
    } else {
      const parentToRemove = previewerDom.firstChild;
      previewerDom.replaceChildren(...parentToRemove.children);
      preview.isDesktopPreview = false;
    }
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
        // lineNumber: true,
        // expandCode: true,
        copyCode: true,
        editCode: true,
        changeLang: true,
        // wrapperRender: (lang, code, html) => {
        //   return `<div class="custom-codeblock-wrapper language-${lang}" data-tips="You can customize the outer container of the code block">${html}</div>`;
        // },
        // customRenderer: {
        //   mermaid: {
        //     render: (src, sign, cherryEngine, lang) => {
        //       return `<pre data-svg="data-diagram-mermaid" class="mermaid diagram-m">\n${src}\n</pre>\n`;
        //     },
        //   },
        // },
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
      "drawIo",
      "proTable",
      "togglePreview",
      "customViewDesktop",
      "search",
      "shortcutKey",
    ],
    toolbarRight: ["export", "|", "switchModel"],
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
    sidebar: ["mobilePreview", "copy", "theme", "codeTheme"],
    toc: {
      defaultModel: "full",
    },
    customMenu: {
      customViewDesktop,
    },
  },
  drawioIframeUrl: "./drawio.html",
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

      addDiagramTool(html);
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
    codeBlockTheme: "default",
    inlineCodeTheme: "red", // red or black
    themeList: [
      { className: "default", label: "Default" }, // 曾用名：light 明亮
      { className: "dark", label: "Dark" },
      { className: "gray", label: "Gray" },
      { className: "abyss", label: "Abyss" },
      { className: "green", label: "Green" },
      { className: "red", label: "Red" },
      { className: "violet", label: "Violet" },
      { className: "blue", label: "Blue" },
    ],
  },
};

export { basicConfig };
