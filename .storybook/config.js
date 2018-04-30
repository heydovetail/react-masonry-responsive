import { configure } from "@storybook/react";
import { cssRule } from "typestyle";

cssRule("*", {
  boxSizing: "border-box",
  "-webkit-tap-highlight-color": ["rgba(0,0,0,0)", "transparent"]
});

cssRule("html", {
  position: "relative"
});

cssRule("body", {
  fontFamily: "sans-serif",
  margin: "48px",
  padding: 0
});

const req = require.context("../src", true, /.*\.stories.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
