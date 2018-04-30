import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Masonry, MasonryItem } from "../";

storiesOf("Masonry", module).add("default", () => {
  class Example extends React.PureComponent {
    public render() {
      const items: MasonryItem[] = [];
      let step: number;

      for (step = 0; step < 50; step++) {
        items.push({
          id: `${step}`,
          node: <Box id={step} height={Math.random() * (500 - 100) + 100} />
        });
      }

      return <Masonry minColumnWidth={200} items={items} />;
    }
  }

  return <Example />;
});

function Box(props: { id: number; height: number }) {
  return (
    <div
      style={{
        backgroundColor: "#512da8",
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
