import * as React from "react";
import ReactResizeDetector from "react-resize-detector";

const DEFAULT_GUTTER = 32;

export interface MasonryItem {
  id: string;
  node: React.ReactNode;
}

export interface Props {
  containerWidth?: number;
  gutter?: number;
  items: MasonryItem[];
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
    const spec = this.columnSpec();

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
        {spec !== null
          ? items.map(item => (
              <div
                data-masonary-item
                key={item.id}
                style={{
                  flex: "1 1 auto",
                  margin: margin,
                  width: spec.width
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

  private readonly columnSpec = () => {
    const { containerWidth } = this.state;
    if (containerWidth !== undefined) {
      const { gutter = DEFAULT_GUTTER, minColumnWidth } = this.props;
      let count = Math.floor(
        (containerWidth + gutter) / (minColumnWidth + gutter)
      );
      count = Math.max(count, 1);
      let width = (containerWidth - gutter * (count - 1)) / count;
      width = width > containerWidth ? containerWidth : width;
      return { count, gutter, width };
    }
    return null;
  };

  private readonly applyMasonryLayout = () => {
    if (this.container !== null) {
      const spec = this.columnSpec();
      if (spec !== null) {
        const { count: columnCount, gutter, width: columnWidth } = spec;
        const columnHeights = zeroes(columnCount);

        Array.prototype.slice
          .call(this.container.children)
          .forEach((element: HTMLElement) => {
            if (
              element instanceof HTMLElement &&
              element.getAttribute("data-masonary-item") !== null
            ) {
              // Index of the column that the item should be placed in.
              const columnTarget = columnHeights.indexOf(
                Math.min(...columnHeights)
              );

              element.style.top = `${columnHeights[columnTarget]}px`;
              element.style.left = `${columnTarget * (columnWidth + gutter)}px`;
              element.style.margin = null;
              element.style.position = "absolute";

              columnHeights[columnTarget] += element.clientHeight + gutter;
            }
          });

        const maxColumnHeight = Math.max(...columnHeights);

        this.container.style.height = `${maxColumnHeight - gutter}px`;
        this.container.style.margin = null;
      }
    }
  };
}

function zeroes(n: number) {
  return Array(...Array(n)).map(() => 0);
}
