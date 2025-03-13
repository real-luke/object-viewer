# ObjectViewer - JavaScript Object Visualizer

A lightweight utility for visualizing JavaScript objects in a collapsible tree structure.

[ObjectViewer Demo](https://codepen.io/jundell/pen/dPyZGjO)

## Features

- **Hierarchical Visualization**: Expandable/collapsible tree structure for objects
- **Type Support**:
  - Primitives (string, number, boolean, null, undefined)
  - Special objects (Date, RegExp)
  - Arrays and custom objects
  - Functions and symbols
- **Prototype Awareness**: Shows prototype chain when relevant
- **Error Handling**: Safe property access and error display
- **Styling**:
  - Color-coded type indicators
  - Different styles for enumerable/non-enumerable properties
  - Customizable CSS classes

## Installation

Include directly in HTML:
```html
<link rel="stylesheet" href="ObjectViewer.css">
<script src="ObjectViewer.js"></script>
```

## Usage

Run `ObjectViewer.view(data, container)` where data is the object to view, and container is a DOM element to append the tree to.
```js
const wrapper = document.getElementById("wrapper");
const data = {
  name: "John",
  age: 30,
  date: new Date(),
  married: false,
  address: { street: "123 Main St", city: "Anytown" }
};

ObjectViewer.view(data, document.body);
```
