import * as React from "react";
import ReactResizeDetector from "react-resize-detector";

const DEFAULT_GAP = 32;

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
  columns: number | null;
}

export class Masonry extends React.PureComponent<Props, State> {
  public state: State = {
    columns: null
  };

  public render() {
    const { gap = DEFAULT_GAP } = this.props;
    const reorderedItems = this.reorder();

    return (
      <div
        style={{
          columns: `auto ${this.state.columns}`,
          columnGap: 0,
          margin: -gap
        }}
      >
        {reorderedItems
          ? reorderedItems.map(item => (
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
            ))
          : null}
        {process.env.NODE_ENV === "test" ? null : <ReactResizeDetector handleWidth onResize={this.resize} />}
      </div>
    );
  }

  private reorder = () => {
    const { items } = this.props;
    const { columns } = this.state;

    if (columns === null) {
      return null;
    }

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

  private readonly resize = (containerWidth: number) => {
    const { gap = DEFAULT_GAP, minColumnWidth } = this.props;
    let columns = Math.floor((containerWidth + gap) / (minColumnWidth + gap));
    columns = Math.max(columns, 1);
    this.setState({ columns });
  };
}

interface RenderedItem extends MasonryItem {
  isLast: boolean;
}
