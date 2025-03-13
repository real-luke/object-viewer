# ObjectViewer - JavaScript Object Visualizer

A lightweight utility for visualizing JavaScript objects in a collapsible tree structure directly in the browser.

![ObjectViewer Demo](demo-screenshot.png) *(Screenshot placeholder)*

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

### Browser Usage
Include directly in HTML:
```html
<link rel="stylesheet" href="ObjectViewer.css">
<script src="ObjectViewer.js"></script>
```
