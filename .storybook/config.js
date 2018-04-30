import { configure } from "@storybook/react";
import { cssRaw } from "typestyle";

cssRaw(`
* {
  box-sizing: border-box;
}

html {
  position: relative;
}

body {
  background: #ffffff;
  color: #140b2f;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  padding-bottom: 64px;
  -webkit-font-smoothing: antialiased;
}

a {
  text-decoration: none;
}
`);

const req = require.context("../src", true, /.*\.stories.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
