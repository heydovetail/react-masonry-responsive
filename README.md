# react-masonry-responsive

A lightweight, performant, and responsive masonry layout for React.

![Demo of react-masonry-responsive](https://raw.githubusercontent.com/heydovetail/react-masonry-responsive/master/img/demo.gif)

## Features

* Satisfies the masonry requirements laid out in [this article](https://regisphilibert.com/blog/2017/12/pure-css-masonry-layout-with-flexbox-grid-columns-in-2018/)
* Easy-to-use interface – pass items along with desired column width
* Fully responsive column width and column count based on container size
* Full-bleed columns – no extra gutter on the left and right
* Server-side render support for frameworks like [Gatsby](https://www.gatsbyjs.org/)
* Small library with one dependency
* No cheesy baked-in animations

## Installation

### Yarn

```bash
yarn add react-masonry-responsive
```

### NPM

```bash
npm i react-masonry-responsive
```

## Example implementation

```jsx
import { Masonry, MasonryItem } from "react-masonry-responsive"
import * as React from "react";

function SimpleExample(props: (items: MasonryItem)) {
  return (
    <Masonry
      items={props.items}
      minColumnWidth={128}
    />
  );
}

function AdvancedExample(props: (items: MasonryItem)) {
  return (
    <div style={{maxWidth: 800}}>
      <Masonry
        containerWidth={800}
        gap={16}
        items={props.items}
        minColumnWidth={128}
      />
    </div>
  );
}
```

## Props

Items are an array of objects with a unique key and a React node. Ideally, the key would be something like a UUID.

```jsx
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
  // should be an object a unique key and a node (React component).
  items: MasonryItem[];

  // The desired width for each column in the masonry layout. When columns
  // go below this width, the number of columns will reduce.
  minColumnWidth: number;
}
```

## How it works

This library uses [CSS columns](https://developer.mozilla.org/en-US/docs/Web/CSS/columns) rather than transforms, absolute positioning, flexbox, or grid. CSS columns are the simplest way to create a responsive masonry layout, however, by default, columns display content from top-to-bottom, rather than left-to-right, as shown in [this demo](https://masonry-css-js.netlify.com/). This is because columns are primarily designed for text layout, to emulate a newspaper or magazine.

This library has an algorithm that reorders items based on the number of columns (determined by the container width), and then uses the CSS properties [`break-inside`](https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside) and [`break-after`](https://developer.mozilla.org/en-US/docs/Web/CSS/break-after) to further control which columns items should appear in to preserve the left-to-right ordering. Thanks to Jesse Korzan for [the original inspiration](https://hackernoon.com/masonry-layout-technique-react-demo-of-100-css-control-of-the-view-e4190fa4296) for the technique!

## Known issues

The CSS property [`break-after`](https://developer.mozilla.org/en-US/docs/Web/CSS/break-after) can be used to force items to break into a new column. Without this property, if the items in the masonry layout are significantly varied in height, some will ‘jump’ to the next column rather than add to the end of a column, breaking the left-to-right order. Firefox does not support the property `break-after`, so in Firefox, some items will end up near the top of the masonry grid, rather than at the bottom.

There’s [a polyfill by Adobe](https://github.com/adobe-webplatform/css-regions-polyfill) that might add support for `break-after` in Firefox.

## Build status

[![CircleCI](https://circleci.com/gh/heydovetail/react-masonry-responsive.svg?style=svg)](https://circleci.com/gh/heydovetail/react-masonry-responsive)
