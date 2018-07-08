import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Masonry, MasonryItem } from "../";

storiesOf("Masonry", module)
  .add("Example", () => {
    return <Masonry minColumnWidth={256} items={generateItems(50)} />;
  })
  .add("Custom gap", () => {
    return <Masonry gap={96} minColumnWidth={200} items={generateItems(50)} />;
  })
  .add("Wide column width", () => {
    return <Masonry minColumnWidth={600} items={generateItems(50)} />;
  })
  .add("Server-side rendering", () => {
    return (
      <div style={{ margin: "0 auto", maxWidth: 800 }}>
        <Masonry containerWidth={800} minColumnWidth={128} items={generateItems(50)} />
      </div>
    );
  })
  .add("Lots of items", () => {
    return <Masonry minColumnWidth={128} items={generateItems(1000)} />;
  });

function generateItems(count: number) {
  const items: MasonryItem[] = [];

  for (let step = 1; step < count + 1; step++) {
    items.push({ key: step, node: <Box id={step} height={Math.random() * (1000 - 100) + 100} /> });
  }

  return items;
}

const COLORS = ["#f84f77", "#512da8", "#5182f8", "#1eb8c1", "#009688"];

function Box(props: { id: number; height: number }) {
  return (
    <div
      style={{
        backgroundColor: COLORS[props.id % COLORS.length],
        color: "#fff",
        borderRadius: "4px",
        height: props.height,
        padding: "24px",
        width: "100%"
      }}
    >
      {props.id}
    </div>
  );
}
