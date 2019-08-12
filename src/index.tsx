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

  // Optional. Equalize the height of items on each row.
  equalHeight?: boolean;

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
    const { gap = DEFAULT_GAP, items, minColumnWidth,equalHeight } = this.props;
    const { containerWidth } = this.state;
    const margin = gap / 2;
    const count = containerWidth !== undefined ? columnCount(containerWidth, gap, minColumnWidth) : null;
    let content: React.ReactNode | null = null;

    if (count !== null && items.length > 0) {
      const columns = sort(count, items);

      content = equalHeight ? (
          <div style={{display: "flex", margin: -margin, justifyContent: "space-between", flexWrap: "wrap"}}>
              {columns.map((c) => (
                  c.map(i => (
                      <div key={i.key} style={{padding: margin, width: `${100 / columns.length}%`}}>
                          {i.node}
                      </div>
                  ))
              ))}
          </div>
      ) : (
        <div style={{ display: "flex", margin: -margin }}>
          {columns.map((c, i) => (
            <div key={i} style={{ flex: "1 1 auto", width: `${100 / columns.length}%` }}>
              {c.map(i => (
                <div key={i.key} style={{ padding: margin }}>
                  {i.node}
                </div>
              ))}
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

type Column = MasonryItem[];

function sort(count: number, items: MasonryItem[]): Column[] {
  let columns: Column[] = Array.apply([], Array(count));
  columns = columns.map(() => []);

  let curr = 0;
  for (const i in items) {
    columns[curr].push(items[i]);
    curr = curr < count - 1 ? curr + 1 : 0;
  }

  return columns;
}

function columnCount(containerWidth: number, gap: number, minColumnWidth: number): number {
  const columns = Math.floor((containerWidth + gap) / (minColumnWidth + gap));
  return Math.max(columns, 1);
}
