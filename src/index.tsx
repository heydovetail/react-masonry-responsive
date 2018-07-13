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
  containerWidth?: number;
}

export class Masonry extends React.PureComponent<Props, State> {
  public state: State = {
    containerWidth: this.props.containerWidth
  };

  public render() {
    const { gap = DEFAULT_GAP, items, minColumnWidth } = this.props;
    const { containerWidth } = this.state;
    const margin = gap / 2;

    const columns = containerWidth !== undefined ? calculateColumnCount(containerWidth, gap, minColumnWidth) : null;
    let content: React.ReactNode | null = null;

    // Necessary for a strange Chrome columns bug. Basically we need to trash
    // the whole columns div when the items change otherwise Chrome messes up.
    let key: string = "";
    items.forEach(i => (key += i.key));

    if (columns !== null && items.length > 0) {
      content = (
        <div
          key={key}
          style={{
            columns: `auto ${columns}`,
            columnGap: 0,
            margin: -margin
          }}
        >
          {reorder(columns, items).map(item => (
            <div
              key={item.key}
              style={{
                breakAfter: item.isLast ? "column" : "avoid-column",
                breakInside: "avoid",
                padding: margin,
                pageBreakInside: "avoid"
              }}
            >
              {item.node}
            </div>
          ))}
        </div>
      );
    }

    return (
      <>
        {content}
        {process.env.NODE_ENV === "test" ? null : (
          <ReactResizeDetector handleWidth onResize={width => this.setState({ containerWidth: width })} />
        )}
      </>
    );
  }
}

interface ReorderedItem extends MasonryItem {
  isLast: boolean;
}

function reorder(columns: number, items: MasonryItem[]): ReorderedItem[] {
  const reorderedItems: ReorderedItem[] = [];
  let col = 0;

  while (col < columns) {
    for (let i = 0; i < items.length; i += columns) {
      if (i + col < items.length) {
        const curr = items[i + col];
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
}

function calculateColumnCount(containerWidth: number, gap: number, minColumnWidth: number): number {
  const columns = Math.floor((containerWidth + gap) / (minColumnWidth + gap));
  return Math.max(columns, 1);
}
