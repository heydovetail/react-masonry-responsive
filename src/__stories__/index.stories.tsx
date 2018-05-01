import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Masonry, MasonryItem } from "../";

storiesOf("Masonry", module)
  .add("default", () => {
    return <Masonry minColumnWidth={128} items={generateItems(50)} />;
  })
  .add("custom gutter", () => {
    return <Masonry gap={96} minColumnWidth={200} items={generateItems(50)} />;
  })
  .add("with containerWidth", () => {
    return (
      <div style={{ margin: "0 auto", maxWidth: 800 }}>
        <Masonry containerWidth={800} minColumnWidth={128} items={generateItems(50)} />
      </div>
    );
  })
  .add("lots of items", () => {
    return <Masonry minColumnWidth={128} items={generateItems(1000)} />;
  });

function generateItems(count: number) {
  const items: MasonryItem[] = [];

  for (let step = 1; step < count + 1; step++) {
    items.push(<Box id={step} height={Math.random() * (500 - 100) + 100} />);
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
        borderRadius: "3px",
        height: props.height,
        padding: "24px",
        width: "100%"
      }}
    >
      {props.id}
    </div>
  );
}
