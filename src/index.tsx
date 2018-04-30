import * as React from "react";
import ReactResizeDetector from "react-resize-detector";

export interface MasonryItem {
  id: string | number;
  node: React.ReactNode;
}

export interface Props {
  // Optional initial container width.
  // Used for server-side rendering to reduce the
  // jarring ‘snap’ when JS loads.
  containerWidth?: number;

  // Optional gap between masonry items.
  // Default gap is 32px.
  gap?: number;

  // An array of masonry items to display.
  items: MasonryItem[];

  // The minimum width for each masonry column. When a column goes
  // below this number, the number of columns will reduce by 1.
  minColumnWidth: number;
}

export interface State {
  containerWidth?: number;
}

export default class Masonry extends React.PureComponent<Props, State> {
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
    const { gap = 32, items } = this.props;
    const spec = this.columnSpec();

    return (
      <div
        ref={div => {
          this.container = div;
        }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          margin: -gap / 2,
          minHeight: 1
        }}
      >
        {spec !== null
          ? items.map(item => (
              <div
                data-masonary-item
                key={item.id}
                style={{ flex: "1 1 auto", margin: gap / 2, width: spec.width }}
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
      let count = 1;
      let width = containerWidth;
      const { gap = 16 } = this.props;
      while (true) {
        const candidateCount = count + 1;
        const candidateWidth =
          (containerWidth - (candidateCount - 1) * gap) / candidateCount;
        if (candidateWidth > this.props.minColumnWidth) {
          count = candidateCount;
          width = candidateWidth;
        } else {
          break;
        }
      }
      return { count, gap, width };
    }
    return null;
  };

  private readonly applyMasonryLayout = () => {
    if (this.container !== null) {
      const spec = this.columnSpec();
      if (spec !== null) {
        const { count: columnCount, gap, width: columnWidth } = spec;
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
              element.style.left = `${columnTarget * (columnWidth + gap)}px`;
              element.style.margin = null;
              element.style.position = "absolute";

              columnHeights[columnTarget] += element.clientHeight + gap;
            }
          });

        const maxColumnHeight = Math.max(...columnHeights);

        this.container.style.height = `${maxColumnHeight - gap}px`;
        this.container.style.margin = null;
      }
    }
  };
}

function zeroes(n: number) {
  return Array(...Array(n)).map(() => 0);
}
