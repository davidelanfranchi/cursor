# Cursor

Small utility that:

1. appends an element to `document.body` or to a container element;
2. sets the transform property of the element based on `mousemove` event;
3. adds, removes, changes data-attributes of the element based on `mouseover`/ `mouseout` event;

Useful to create and animate an element that follow mouse movement.

## Options

- `container: container element, default to `document.body`;
- `elementClass`: class to assign to the cursor element
- `innerElementClass`: class to assign to the inner cursor element
- `defaultType`: default cursor type
- `innerMarkup`: custom markup of the inner element (makes `innerElementClass` useless)
