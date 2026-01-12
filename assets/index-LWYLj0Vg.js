(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();const i=`# Complex Diagrams

> MarkView supports complex Mermaid diagrams with interactive features like zooming and panning.

## Features

- Click the expand button (top-right corner of diagram) to **Open Fullscreen** view
- In fullscreen mode:
  - **Zoom In/Out**: Use the +/- buttons or mouse wheel
  - **Pan**: Click and drag to move around
  - **Reset View**: Click the reset button to return to original size
  - **Close**: Click the X button or press ESC key
- **Print-friendly**: Try printing this page (Ctrl+P / Cmd+P) - the expand buttons and modal should be hidden, and diagrams should print cleanly.

---

## HTTP 401 + Client-initiated

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Browser
    participant SPA
    participant Backend
    participant Session Store
    participant Keycloak

    User->>SPA: Access protected resource (/dashboard)
    Note over SPA: SPA saves current state
    SPA->>Backend: GET /api/dashboard
    Note over SPA,Backend: CORS applies
    Backend-->>SPA: 401 Unauthorized
    Note over SPA: SPA calls login() function
    SPA->>Browser: window.open('/oauth2/authorization/keycloak?redirect_uri=/dashboard&scope=openid', '_self')
    Browser->>Backend: GET /oauth2/authorization/keycloak?redirect_uri=/dashboard&scope=openid
    Backend->>Session Store: Create session, save original URL (/dashboard)
    Session Store-->>Backend: Return session ID
    Backend->>Backend: Generate state parameter
    Backend->>Session Store: Store state parameter
    Backend-->>Browser: 302 Redirect to Keycloak (with state parameter)
    Note over Browser: Store session ID in secure cookie
    Note over Browser: Set cookie flags: HttpOnly, Secure, SameSite=Lax
    Browser->>Keycloak: Follow redirect (with state parameter)
    alt Authentication Success
        Keycloak-->>Browser: Present login page
        Browser-->>User: Display login page
        User->>Browser: Enter credentials
        Browser->>Keycloak: Submit credentials
        Keycloak-->>Browser: 302 Redirect to Backend with auth code
        Browser->>Backend: Follow redirect with auth code, session cookie, and state
        Backend->>Session Store: Validate state parameter
        Backend->>Keycloak: Exchange code for tokens
        Keycloak-->>Backend: Return tokens (access, refresh, id)
        Backend->>Backend: Validate id token
        Backend->>Session Store: Update session with tokens
        Backend->>Backend: Generate CSRF token
        Backend->>Session Store: Store CSRF token in session
        Backend->>Session Store: Retrieve original URL from session
        Session Store-->>Backend: Return original URL (/dashboard)
        Backend-->>Browser: 302 Redirect to original URL (/dashboard)
        Note over Browser: Update session cookie, set CSRF cookie
        Note over Browser: Set cookie flags: HttpOnly, Secure, SameSite=Strict for session
        Note over Browser: Set cookie flags: Secure, SameSite=Strict for CSRF (not HttpOnly)
        Browser->>SPA: Load SPA with /dashboard route
        Note over SPA: SPA restores saved state
        SPA->>SPA: Read CSRF token from cookie
        SPA->>Backend: GET /api/dashboard (with session cookie and CSRF token in header)
        Note over SPA,Backend: CORS applies, CSRF validated
        Backend->>Session Store: Validate session and retrieve user data
        Session Store-->>Backend: Return user data
        Backend-->>SPA: Return dashboard data
        SPA-->>User: Display dashboard
    else Authentication Failure
        Keycloak-->>Browser: Return error
        Browser->>Backend: Redirect to error handler
        Backend->>Backend: Log error
        Backend-->>Browser: Display error page
        Browser-->>User: Show authentication error
    end

    Note over SPA,Backend: CORS is relevant for all SPA-Backend interactions
    Note over Browser,Keycloak: Browser redirects are not subject to CORS
    Note over SPA: State management happens client-side
    Note over SPA,Backend: Original URL (/dashboard) is preserved and used after auth
    Note over SPA,Backend: CSRF token read from cookie and sent in header
    Note over Browser: All cookies use Secure flag to ensure HTTPS-only transmission
    Note over Browser: Session cookie uses HttpOnly to prevent JS access
    Note over Browser: SameSite=Strict for session, SameSite=Lax for initial auth
\`\`\`

---

## Refresh Token Flow

\`\`\`mermaid
sequenceDiagram
    participant User
    participant SPA
    participant Browser
    participant Backend
    participant Session Store
    participant Keycloak

    Note over SPA: Access token expires
    SPA->>Backend: API request with expired access token
    Note over SPA,Backend: CORS applies
    Backend->>Session Store: Check token status
    Session Store-->>Backend: Token expired, return refresh token
    Backend->>Keycloak: Request new tokens using refresh token
    alt Refresh Successful
        Keycloak-->>Backend: Return new access and refresh tokens
        Backend->>Session Store: Update session with new tokens
        Backend->>Backend: Generate new CSRF token
        Backend->>Session Store: Store new CSRF token in session
        Backend-->>Browser: Set new session and CSRF cookies
        Note over Browser: Update cookies (HttpOnly, Secure, SameSite=Strict)
        Backend-->>SPA: Return success status (200 OK)
        SPA->>Backend: Retry original API request
        Backend->>Session Store: Validate session and retrieve user data
        Session Store-->>Backend: Return user data
        Backend-->>SPA: Return requested API data
    else Refresh Failed (e.g., refresh token expired)
        Keycloak-->>Backend: Return error
        Backend->>Session Store: Clear invalid session
        Backend-->>Browser: Clear session and CSRF cookies
        Backend-->>SPA: Return authentication error (401 Unauthorized)
        Note over SPA: Redirect to login page
        SPA-->>User: Display login required message
    end

    Note over SPA,Backend: CORS is relevant for all SPA-Backend interactions
    Note over Backend,Keycloak: Backend-Keycloak communication is server-to-server
    Note over SPA: SPA handles token refresh transparently to the user
    Note over Backend: Refresh token never sent to client
    Note over Browser: Cookies updated with secure flags
\`\`\`
`,c=Cherry.createSyntaxHook("codeBlock",Cherry.constants.HOOKS_TYPE_LIST.PAR,{makeHtml(e){return console.warn("custom hook","hello"),e},rule(e){const n={begin:"",content:"",end:""};return n.reg=new RegExp(n.begin+n.content+n.end,"g"),n}}),l=Cherry.createMenuHook("bold italic",{iconName:"font",onClick:function(e){let n=this.getSelection(e)||"bold italic";return!this.isSelections&&!/^\s*(\*\*\*)[\s\S]+(\1)/.test(n)&&this.getMoreSelection("***","***",()=>{const t=this.editor.editor.getSelection(),o=/^\s*(\*\*\*)[\s\S]+(\1)/.test(t);return o&&(n=t),o}),/^\s*(\*\*\*)[\s\S]+(\1)/.test(n)?n.replace(/(^)(\s*)(\*\*\*)([^\n]+)(\3)(\s*)($)/gm,"$1$4$7"):(this.registerAfterClickCb(()=>{this.setLessSelection("***","***")}),n.replace(/(^)([^\n]+)($)/gm,"$1***$2***$3"))}}),d=Cherry.createMenuHook("lab",{icon:{type:"svg",content:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>',iconStyle:"width: 15px; height: 15px; vertical-align: middle;"}}),u=Cherry.createMenuHook("helpcenter",{iconName:"question",onClick:(e,n)=>{switch(n){case"shortKey":return`${e}shortcut key here: https://codemirror.net/5/demo/sublime.html`;case"github":return`${e}we are here: https://github.com/Tencent/cherry-markdown`;case"release":return`${e}we are here: https://github.com/Tencent/cherry-markdown/releases`;default:return e}},subMenuConfig:[{noIcon:!0,name:"shortcut key",onclick:e=>{cherry.toolbar.menus.hooks.customMenuCName.fire(null,"shortKey")}},{noIcon:!0,name:"github",onclick:e=>{cherry.toolbar.menus.hooks.customMenuCName.fire(null,"github")}},{noIcon:!0,name:"release log",onclick:e=>{cherry.toolbar.menus.hooks.customMenuCName.fire(null,"release")}}]}),h=Cherry.createMenuHook("chart",{iconName:"trendingUp",subMenuConfig:[{noIcon:!0,name:"line chart",onclick:e=>{cherry.insert(`
| :line:{"title": "Line Chart"} | Header1 | Header2 | Header3 | Header4 |
| ------ | ------ | ------ | ------ | ------ |
| Sample1 | 11 | 11 | 4 | 33 |
| Sample2 | 112 | 111 | 22 | 222 |
| Sample3 | 333 | 142 | 311 | 11 |
`)}},{noIcon:!0,name:"bar chart",onclick:e=>{cherry.insert(`
| :bar:{"title": "Bar Chart"} | Header1 | Header2 | Header3 | Header4 |
| ------ | ------ | ------ | ------ | ------ |
| Sample1 | 11 | 11 | 4 | 33 |
| Sample2 | 112 | 111 | 22 | 222 |
| Sample3 | 333 | 142 | 311 | 11 |
`)}},{noIcon:!0,name:"radar chart",onclick:e=>{cherry.insert(`
| :radar:{"title": "Radar Chart"} | Skill 1 | Skill 2 | Skill 3 | Skill 4 | Skill 5 |
| ------ | ------ | ------ | ------ | ------ | ------ |
| User A | 90 | 85 | 75 | 80 | 88 |
| User B | 75 | 90 | 88 | 85 | 78 |
| User C | 85 | 78 | 90 | 88 | 85 |
`)}},{noIcon:!0,name:"heatmap",onclick:e=>{cherry.insert(`
| :heatmap:{"title": "Heatmap"} | Monday | Tuesday | Wednesday | Thursday | Friday |
| ------ | ------ | ------ | ------ | ------ | ------ |
| Morning | 10 | 20 | 30 | 40 | 50 |
| Afternoon | 15 | 25 | 35 | 45 | 55 |
| Evening | 5 | 15 | 25 | 35 | 45 |
`)}},{noIcon:!0,name:"pie chart",onclick:e=>{cherry.insert(`
| :pie:{"title": "Pie Chart"} | 数值 |
| ------ | ------ |
| 苹果 | 40 |
| 香蕉 | 30 |
| 橙子 | 20 |
| 葡萄 | 10 |
`)}},{noIcon:!0,name:"scatter chart",onclick:e=>{cherry.insert(`
| :scatter:{"title": "Scatter Chart", "cherry:mapping": {"x": "X", "y": "Y", "size": "Size", "series": "Series"}} | X | Y | Size | Series |
| ------ | ------ | ------ | ------ | ------ |
| A1 | 10 | 20 | 5 | S1 |
| A2 | 15 | 35 | 8 | S1 |
| B1 | 30 | 12 | 3 | S2 |
| B2 | 25 | 28 | 6 | S2 |
| C1 | 50 | 40 | 9 | S3 |
| C2 | 60 | 55 | 7 | S3 |
`)}}]}),k={id:"markdown",locale:"en_US",externals:{echarts:window.echarts,katex:window.katex,MathJax:window.MathJax},isPreviewOnly:!1,engine:{global:{htmlAttrWhiteList:"part|slot",flowSessionContext:!1},syntax:{link:{attrRender:(e,n)=>""},image:{videoWrapper:(e,n,t)=>(console.log(n),t)},autoLink:{target:"",rel:"",enableShortLink:!0,shortLinkLength:20,attrRender:(e,n)=>""},codeBlock:{theme:"twilight",lineNumber:!0,expandCode:!0,copyCode:!0,editCode:!0,changeLang:!0,wrapperRender:(e,n,t)=>`<div class="custom-codeblock-wrapper language-${e}" data-tips="You can customize the outer container of the code block">${t}</div>`,customBtns:[{html:"Custom button 1",onClick:(e,n,t,o)=>{console.log(`【${t}】: ${n}`),console.log(o)}},{html:"Custom button 2",onClick:(e,n,t,o)=>{console.log(`【${t}】: ${n}`),console.log(o)}}],customRenderer:{}},table:{enableChart:!0},fontEmphasis:{allowWhitespace:!1},strikethrough:{needWhitespace:!1},mathBlock:{engine:"MathJax",src:"https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"},inlineMath:{engine:"MathJax"},emoji:{useUnicode:!0,customResourceURL:"https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8",upperCase:!1},htmlBlock:{removeTrailingNewline:!1},panel:{enableJustify:!0,enablePanel:!0},footnote:{refNumber:{appendClass:"ref-number",render:(e,n)=>`[${e}]`,clickRefNumberCallback:(e,n,t,o)=>{}},refList:{appendClass:"ref-list",title:{appendClass:"ref-list-title",render:()=>""},listItem:{appendClass:"ref-list-item",render:(e,n,t,o)=>`${o(e,n)}${t}`}},bubbleCard:{appendClass:"bubble-card",render:(e,n,t)=>`
              <div class="cherry-ref-bubble-card__title">${e}. ${n}</div>
              <div class="cherry-ref-bubble-card__content">${t}</div>
              <div class="cherry-ref-bubble-card__foot"></div>
            `}}},customSyntax:{CustomHook:{syntaxClass:c,force:!1,after:"br"}}},multipleFileSelection:{video:!0,audio:!1,image:!0,word:!1,pdf:!0,file:!0},toolbars:{toolbar:["bold","italic",{strikethrough:["strikethrough","underline","sub","sup","ruby","customMenuAName"]},"size","|","color","header","|","ol","ul","checklist","panel","align","detail","|","formula",{insert:["image","audio","video","link","hr","br","code","inlineCode","formula","toc","table","pdf","word","file"]},"graph","proTable","togglePreview","search","shortcutKey",{customMenuBName:["ruby","audio","video","customMenuAName"]},"customMenuCName"],toolbarRight:["fullScreen","|","export","wordCount","|","switchModel"],bubble:["bold","italic","underline","strikethrough","sub","sup","quote","ruby","|","size","color"],sidebar:["mobilePreview","copy"],toc:{defaultModel:"full"},customMenu:{customMenuAName:l,customMenuBName:d,customMenuCName:u,customMenuTable:h},shortcutKeySettings:{isReplace:!1,shortcutKeyMap:{"Alt-Digit1":{hookName:"header",aliasName:"Header"},"Control-Shift-KeyX":{hookName:"bold",aliasName:"Bold"}}}},previewer:{floatWhenClosePreviewer:!0},keydown:[],callback:{onClickPreview:e=>{console.log("onClickPreview",e)},afterAsyncRender:(e,n)=>{},urlProcessor(e,n){return console.log("url-processor",e,n),e}},editor:{id:"cherry-text",name:"cherry-text",autoSave2Textarea:!0,defaultModel:"edit&preview",showFullWidthMark:!0,showSuggestList:!0,maxUrlLength:200,codemirror:{placeholder:"Enter text or / to start editing"}},autoScrollByHashAfterInit:!0,themeSettings:{mainTheme:"default"}},S=Object.assign({},k,{value:i});window.cherry=new Cherry(S);
