/**
 * Customize a syntax
 */
const CustomHookA = Cherry.createSyntaxHook("codeBlock", Cherry.constants.HOOKS_TYPE_LIST.PAR, {
  makeHtml(str) {
    console.warn("custom hook", "hello");
    return str;
  },
  rule(str) {
    const regex = {
      begin: "",
      content: "",
      end: "",
    };
    regex.reg = new RegExp(regex.begin + regex.content + regex.end, "g");
    return regex;
  },
});

/**
 * Customize a menu
 * The first time you click, the selected text will be bold and italic
 * The second time you click, the bold italic text will be changed to plain text
 */
const customMenuA = Cherry.createMenuHook("bold italic", {
  iconName: "font",
  onClick: function (selection) {
    // Get the selected text, if the user has not selected any text, it will try to get the word or sentence where the cursor is located
    let $selection = this.getSelection(selection) || "bold italic";
    // If it is a single selection and the selected content does not have bold syntax at the beginning and end, expand the selection range
    if (!this.isSelections && !/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)) {
      this.getMoreSelection("***", "***", () => {
        const newSelection = this.editor.editor.getSelection();
        const isBoldItalic = /^\s*(\*\*\*)[\s\S]+(\1)/.test(newSelection);
        if (isBoldItalic) {
          $selection = newSelection;
        }
        return isBoldItalic;
      });
    }
    // If the selected text already has bold syntax, remove the bold syntax
    if (/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)) {
      return $selection.replace(/(^)(\s*)(\*\*\*)([^\n]+)(\3)(\s*)($)/gm, "$1$4$7");
    }
    /**
     * Register the rule for shrinking the selection
     *    After registration, inserting "***TEXT***" will change the selection to "***[TEXT]***"
     *    If not registered, the effect after insertion will be "[***TEXT***]"
     */
    this.registerAfterClickCb(() => {
      this.setLessSelection("***", "***");
    });
    return $selection.replace(/(^)([^\n]+)($)/gm, "$1***$2***$3");
  },
});
/**
 * Define an empty shell, used to plan the hierarchy structure of cherry's existing toolbar
 */
const customMenuB = Cherry.createMenuHook("lab", {
  icon: {
    type: "svg",
    content:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>',
    iconStyle: "width: 15px; height: 15px; vertical-align: middle;",
  },
});
/**
 * Define a toolbar with a secondary menu
 */
const customMenuC = Cherry.createMenuHook("helpcenter", {
  iconName: "question",
  onClick: (selection, type) => {
    switch (type) {
      case "shortKey":
        return `${selection}shortcut key here: https://codemirror.net/5/demo/sublime.html`;
      case "github":
        return `${selection}we are here: https://github.com/Tencent/cherry-markdown`;
      case "release":
        return `${selection}we are here: https://github.com/Tencent/cherry-markdown/releases`;
      default:
        return selection;
    }
  },
  subMenuConfig: [
    {
      noIcon: true,
      name: "shortcut key",
      onclick: (event) => {
        cherry.toolbar.menus.hooks.customMenuCName.fire(null, "shortKey");
      },
    },
    {
      noIcon: true,
      name: "github",
      onclick: (event) => {
        cherry.toolbar.menus.hooks.customMenuCName.fire(null, "github");
      },
    },
    {
      noIcon: true,
      name: "release log",
      onclick: (event) => {
        cherry.toolbar.menus.hooks.customMenuCName.fire(null, "release");
      },
    },
  ],
});

/**
 * Define a button with charts and tables
 */
const customMenuTable = Cherry.createMenuHook("chart", {
  iconName: "trendingUp",
  subMenuConfig: [
    {
      noIcon: true,
      name: "line chart",
      onclick: (event) => {
        cherry.insert(
          '\n| :line:{"title": "Line Chart"} | Header1 | Header2 | Header3 | Header4 |\n| ------ | ------ | ------ | ------ | ------ |\n| Sample1 | 11 | 11 | 4 | 33 |\n| Sample2 | 112 | 111 | 22 | 222 |\n| Sample3 | 333 | 142 | 311 | 11 |\n'
        );
      },
    },
    {
      noIcon: true,
      name: "bar chart",
      onclick: (event) => {
        cherry.insert(
          '\n| :bar:{"title": "Bar Chart"} | Header1 | Header2 | Header3 | Header4 |\n| ------ | ------ | ------ | ------ | ------ |\n| Sample1 | 11 | 11 | 4 | 33 |\n| Sample2 | 112 | 111 | 22 | 222 |\n| Sample3 | 333 | 142 | 311 | 11 |\n'
        );
      },
    },
    {
      noIcon: true,
      name: "radar chart",
      onclick: (event) => {
        cherry.insert(
          '\n| :radar:{"title": "Radar Chart"} | Skill 1 | Skill 2 | Skill 3 | Skill 4 | Skill 5 |\n| ------ | ------ | ------ | ------ | ------ | ------ |\n| User A | 90 | 85 | 75 | 80 | 88 |\n| User B | 75 | 90 | 88 | 85 | 78 |\n| User C | 85 | 78 | 90 | 88 | 85 |\n'
        );
      },
    },
    {
      noIcon: true,
      name: "heatmap",
      onclick: (event) => {
        cherry.insert(
          '\n| :heatmap:{"title": "Heatmap"} | Monday | Tuesday | Wednesday | Thursday | Friday |\n| ------ | ------ | ------ | ------ | ------ | ------ |\n| Morning | 10 | 20 | 30 | 40 | 50 |\n| Afternoon | 15 | 25 | 35 | 45 | 55 |\n| Evening | 5 | 15 | 25 | 35 | 45 |\n'
        );
      },
    },
    {
      noIcon: true,
      name: "pie chart",
      onclick: (event) => {
        cherry.insert(
          '\n| :pie:{"title": "Pie Chart"} | 数值 |\n| ------ | ------ |\n| 苹果 | 40 |\n| 香蕉 | 30 |\n| 橙子 | 20 |\n| 葡萄 | 10 |\n'
        );
      },
    },
    {
      noIcon: true,
      name: "scatter chart",
      onclick: (event) => {
        cherry.insert(
          '\n| :scatter:{"title": "Scatter Chart", "cherry:mapping": {"x": "X", "y": "Y", "size": "Size", "series": "Series"}} | X | Y | Size | Series |\n| ------ | ------ | ------ | ------ | ------ |\n| A1 | 10 | 20 | 5 | S1 |\n| A2 | 15 | 35 | 8 | S1 |\n| B1 | 30 | 12 | 3 | S2 |\n| B2 | 25 | 28 | 6 | S2 |\n| C1 | 50 | 40 | 9 | S3 |\n| C2 | 60 | 55 | 7 | S3 |\n'
        );
      },
    },
  ],
});

const basicConfig = {
  id: "markdown",
  locale: "en_US",
  externals: {
    echarts: window.echarts,
    katex: window.katex,
    MathJax: window.MathJax,
  },
  isPreviewOnly: false,
  engine: {
    global: {
      htmlAttrWhiteList: "part|slot",
      flowSessionContext: false,
      // flowSessionCursor: 'default'
    },
    syntax: {
      link: {
        attrRender: (text, href) => {
          return ``;
        },
      },
      image: {
        videoWrapper: (link, type, defaultWrapper) => {
          console.log(type);
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
        customBtns: [
          {
            html: "Custom button 1",
            onClick: (event, code, lang, dom) => {
              console.log(`【${lang}】: ${code}`);
              console.log(dom);
            },
          },
          {
            html: "Custom button 2",
            onClick: (event, code, lang, dom) => {
              console.log(`【${lang}】: ${code}`);
              console.log(dom);
            },
          },
        ],
        customRenderer: {
          // Special configuration "all", which will be applied to all languages
          // 'all': {
          //   render: (src, sign, cherryEngine, lang)=> {
          //     return `<p class="my-render">lang:${lang};code:${src}</p>`;
          //   }
          // }
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
    customSyntax: {
      // SyntaxHookClass
      CustomHook: {
        syntaxClass: CustomHookA,
        force: false,
        after: "br",
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
        strikethrough: ["strikethrough", "underline", "sub", "sup", "ruby", "customMenuAName"],
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
      // 'customMenuTable',
      "togglePreview",
      "search",
      "shortcutKey",
      {
        customMenuBName: ["ruby", "audio", "video", "customMenuAName"],
      },
      "customMenuCName",
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
      "ruby",
      "|",
      "size",
      "color",
    ], // array or false
    sidebar: ["mobilePreview", "copy"],
    toc: {
      defaultModel: "full",
    },
    customMenu: {
      customMenuAName: customMenuA,
      customMenuBName: customMenuB,
      customMenuCName: customMenuC,
      customMenuTable,
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
      // console.log("afterAsyncRender", md, html);
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
