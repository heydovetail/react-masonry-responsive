import { configure } from "@storybook/react";
import { cssRule, forceRenderStyles } from "typestyle";

cssRule("*", {
  boxSizing: "border-box",
  "-webkit-tap-highlight-color": ["rgba(0,0,0,0)", "transparent"],
  "-webkit-font-smoothing": "antialiased"
});

cssRule("html", {
  position: "relative"
});

cssRule("body", {
  fontFamily: "sans-serif",
  margin: "48px",
  padding: 0
});

forceRenderStyles();

const req = require.context("../src", true, /.*\.stories.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
