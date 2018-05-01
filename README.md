# react-masonry-responsive

A lightweight, performant, and responsive masonry layout for React.

![Screenshot of react-masonry-responsive](./img/screenshot.png?raw=true)

## Features

* Easy-to-use interface – just pass items to render and desired column width
* Responsive item widths and column count based on container size
* Uses `position: absolute` for simplicity and performance
* Flexbox fallback for server-side rendering
* Full-bleed columns – no extra gutter on the left and right
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

```jsx
export interface Props {
  // Optional. Used for server-side rendering when there’s
  // no access to the DOM to determine the container width with JS.
  // Pass this through to minimize the ‘snap’ when JS loads / rehydrates.
  containerWidth?: number;

  // Optional gap between items, both horizontally and vertically.
  // Defaults to 32px.
  gap?: number;

  // An array of items to render in the masonry layout. Each item
  // should contain a unique ID (preferably something like UUID)
  // and a component (node) to render.
  items: MasonryItem[];

  // The desired width for each column in the masonry layout. When columns
  // go below this width, the number of columns will reduce.
  minColumnWidth: number;
}
```

## Build status

[![CircleCI](https://circleci.com/gh/heydovetail/react-masonry-responsive.svg?style=svg)](https://circleci.com/gh/heydovetail/react-masonry-responsive)
