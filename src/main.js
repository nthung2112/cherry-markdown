import "cherry-markdown/dist/cherry-markdown.css";
import "cherry-markdown/dist/cherry-markdown";

import basicMd from "./data.md?raw";

import { basicConfig } from "./config.js";

const config = Object.assign({}, basicConfig, { value: basicMd });

window.cherry = new Cherry(config);
