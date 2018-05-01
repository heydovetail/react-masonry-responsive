import * as React from "react";
import ReactResizeDetector from "react-resize-detector";

const DEFAULT_GUTTER = 32;

export interface MasonryItem {
  id: string | number;
  node: React.ReactNode;
}

export interface Props {
  // Optional. Used for server-side rendering when there’s
  // no access to the DOM to determine the container width with JS.
  // Pass this through to minimize the ‘snap’ when JS loads / rehydrates.
  containerWidth?: number;

  // Optional gap between items, both horizontally and vertically.
  // Defaults to 32px.
  gutter?: number;

  // An array of items to render in the masonry layout. Each item
  // should contain a unique ID (preferably something like UUID)
  // and a component (node) to render.
  items: MasonryItem[];

  // The desired width for each column in the masonry layout. When columns
  // go below this width, the number of columns will reduce.
  minColumnWidth: number;
}

export interface State {
  containerWidth?: number;
}

export class Masonry extends React.PureComponent<Props, State> {
  public readonly state: State = {
    containerWidth: this.props.containerWidth
  };

  private container: HTMLDivElement | null = null;

  public componentDidMount() {
    this.applyMasonryLayout();
  }

  public componentDidUpdate() {
    this.applyMasonryLayout();
  }

  public render() {
    const { gutter = DEFAULT_GUTTER, items } = this.props;
    const margin = gutter / 2;
    const layout = this.determineLayout();

    return (
      <div
        ref={div => {
          this.container = div;
        }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          margin: -margin,
          minHeight: 1
        }}
      >
        {layout !== null
          ? items.map(item => (
              <div
                data-masonary-item
                key={item.id}
                style={{
                  flex: "1 1 auto",
                  margin: margin,
                  width: layout.width
                }}
              >
                {item.node}
              </div>
            ))
          : null}
        {process.env.NODE_ENV === "test" ? null : (
          <ReactResizeDetector
            handleWidth
            onResize={width => {
              this.setState({ containerWidth: width });
            }}
          />
        )}
      </div>
    );
  }

  private readonly determineLayout = () => {
    const { containerWidth } = this.state;
    const { gutter = DEFAULT_GUTTER, minColumnWidth } = this.props;

    if (containerWidth === undefined) {
      return null;
    }

    // Determine the number of columns we can fit in the container.
    let count = Math.floor((containerWidth + gutter) / (minColumnWidth + gutter));

    // Prevent count from becoming negative when there’s space for one or less columns.
    count = Math.max(count, 1);

    // Determine the width of each column.
    let width = (containerWidth - gutter * (count - 1)) / count;

    // Allow items to shrink smaller than the minColumnWidth if necessary.
    width = width > containerWidth ? containerWidth : width;

    return { count, gutter, width };
  };

  private readonly applyMasonryLayout = () => {
    const layout = this.determineLayout();

    if (this.container === null || layout === null) {
      return;
    }

    const { count, gutter, width } = layout;
    const columnHeights = zeroes(count);
    const children = Array.prototype.slice.call(this.container.children);

    children.forEach((element: HTMLElement) => {
      if (element instanceof HTMLElement && element.getAttribute("data-masonary-item") !== null) {
        // Index of the column that the item should be placed in.
        const column = columnHeights.indexOf(Math.min(...columnHeights));

        // Set absolute positioning styles
        element.style.top = `${columnHeights[column]}px`;
        element.style.left = `${column * (width + gutter)}px`;
        element.style.position = "absolute";

        // Remove fallback styles for server-side rendering
        element.style.flex = null;
        element.style.margin = null;

        // Increment the height of the column
        columnHeights[column] += element.clientHeight + gutter;
      }
    });

    // Grow the the container to accommodate the highest column
    this.container.style.height = `${Math.max(...columnHeights) - gutter}px`;

    // Remove the fallback server-side rendering style on the container
    this.container.style.margin = null;
  };
}

function zeroes(n: number) {
  return Array(...Array(n)).map(() => 0);
}
