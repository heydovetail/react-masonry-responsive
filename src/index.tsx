import * as React from "react";

export interface MasonryItem {
  key: string | number;
  node: React.ReactNode;
}

export interface Props {
  // Optional. Used for server-side rendering when there’s
  // no access to the DOM to determine the container width with JS.
  // Pass this through for server-side rendering support.
  containerWidth?: number;

  // Optional gap between items, both horizontally and vertically.
  // Defaults to 32px.
  gap?: number;

  // An array of items to render in the masonry layout. Each item
  // should either be a React.ReactNode component to render, or an object
  // with the component and an optional unique key.
  items: MasonryItem[];

  // The desired width for each column in the masonry layout. When columns
  // go below this width, the number of columns will reduce.
  minColumnWidth: number;
}

export interface State {
  columns: number;
}

export class Masonry extends React.PureComponent<Props, State> {
  public readonly state: State = {
    columns: 4
  };

  public render() {
    const { gap = 32 } = this.props;
    const reorderedItems = this.reorder();

    return (
      <div
        style={{
          columns: `auto ${this.state.columns}`,
          columnFill: "balance-all",
          columnGap: 0,
          margin: -gap
        }}
      >
        {reorderedItems.map(item => (
          <div
            key={item.key}
            style={{
              breakAfter: item.isLast ? "column" : "avoid-column",
              breakInside: "avoid",
              padding: gap / 2
            }}
          >
            {item.node}
          </div>
        ))}
      </div>
    );
  }

  private reorder = () => {
    const { items } = this.props;
    const { columns } = this.state;

    const reorderedItems: RenderedItem[] = [];
    let col = 0;

    while (col < columns) {
      for (let i = 0; i < items.length; i += columns) {
        const curr = items[i + col];

        if (curr != null) {
          reorderedItems.push({
            key: curr.key,
            isLast: false,
            node: curr.node
          });
        }
      }
      reorderedItems[reorderedItems.length - 1].isLast = true;
      col++;
    }

    return reorderedItems;
  };
}

interface RenderedItem extends MasonryItem {
  isLast: boolean;
}
