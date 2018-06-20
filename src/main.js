//  Cursor

export default class Cursor {
  constructor(options) {
    // Default options

    const defaults = {
      container: document.body,
      elementClass: "cursor",
      innerElementClass: "cursor__inner",
      defaultType: "default",
      innerMarkup: ""
    };

    // Override with initialization options

    let opts = Object.assign({}, defaults, options);
    Object.keys(defaults).forEach(prop => {
      this[prop] = opts[prop];
    });

    // Properties
    this.name = "cursor";
    this.mousePosition = { x: 0, y: 0 };
    if (this.innerMarkup === "") {
      this.innerMarkup = `<div class="${this.innerElementClass}"></div>`;
    }

    // Return on touch devices

    if (
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
      return false;
    }

    // Utility

    this.transformProperty = this.getTransformProperty();

    // Init

    this.init();
  }

  init() {
    // Add container class - can be used to hide real cursor

    this.container.classList.add("js-has-cursor");

    // Create cursor element

    this.element = document.createElement("div");
    this.element.classList.add(this.elementClass);
    this.element.innerHTML = this.innerMarkup;

    this.element.setAttribute("data-cursor-type", this.defaultType);
    this.element.setAttribute("data-cursor-hiding", "");

    this.container.appendChild(this.element);

    // Listen for events to modify cursor

    this.setMousePosition = this.setMousePosition.bind(this);
    this.container.addEventListener("mousemove", this.setMousePosition, false);

    // Hovering elements

    this.onMouseOver = this.onMouseOver.bind(this);
    this.container.addEventListener("mouseover", this.onMouseOver, false);

    this.onMouseOut = this.onMouseOut.bind(this);
    this.container.addEventListener("mouseout", this.onMouseOut, false);

    // Activity

    this.onMouseDown = this.onMouseDown.bind(this);
    this.container.addEventListener("mousedown", this.onMouseDown, false);

    this.onMouseUp = this.onMouseUp.bind(this);
    this.container.addEventListener("mouseup", this.onMouseUp, false);

    this.start();
  }

  destroy() {
    window.removeEventListener("mousemove", this.setMousePosition, false);
  }

  start() {
    this.raf = window.requestAnimationFrame(() => {
      this.animate();
      this.start();
    });
  }

  stop() {
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
    }
  }

  setMousePosition(e) {
    if (this.container === document.body) {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    } else {
      this.mousePosition.x = e.offsetX;
      this.mousePosition.y = e.offsetY;
    }
  }

  animate() {
    this.element.style[this.transformProperty] = `translate3d(${
      this.mousePosition.x
    }px, ${this.mousePosition.y}px, 0)`;
  }

  onMouseOver(e) {
    if (this.element.hasAttribute("data-cursor-hiding")) {
      this.element.removeAttribute("data-cursor-hiding");
    }

    if (e.target.hasAttribute("data-cursor-type")) {
      this.element.setAttribute(
        "data-cursor-type",
        e.target.getAttribute("data-cursor-type")
      );
    }
  }

  onMouseOut(e) {
    // Out of the window
    if (e.relatedTarget === null) {
      this.element.setAttribute("data-cursor-hiding", "");
    }
    // Out of the container
    if (e.target === this.container) {
      this.element.setAttribute("data-cursor-hiding", "");
    }
  }

  onMouseDown(e) {
    this.element.setAttribute("data-cursor-state", "holding");
  }

  onMouseUp(e) {
    this.element.removeAttribute("data-cursor-state");
  }

  getTransformProperty() {
    let testEl = document.createElement("div");
    if (testEl.style.transform === null) {
      let vendors = ["Webkit", "Moz", "ms"];
      for (let vendor of vendors) {
        if (testEl.style[vendors[vendor] + "Transform"] !== undefined) {
          return vendors[vendor] + "Transform";
        }
      }
    }
    return "transform";
  }
}

window.Cursor = Cursor;
