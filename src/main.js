//  Cursor

export default class Cursor {
  constructor(options) {
    // Default options

    const defaults = {
      name: "cursor",
      mousePosition: { x: 0, y: 0 },
      container: document.body,
      elementClass: "cursor",
      innerElementClass: "cursor__inner",
      defaultState: "default"
    };

    // Override with initialization options

    let opts = Object.assign({}, defaults, options);
    Object.keys(defaults).forEach(prop => {
      this[prop] = opts[prop];
    });

    // Utility

    this.transformProperty = this.getTransformProperty();

    // Init

    this.init();
  }

  init() {
    // Add container class - use it to hide real cursor

    this.container.classList.add("js-has-cursor");

    // Create cursor element

    this.element = document.createElement("div");
    this.element.classList.add(this.elementClass);
    this.element.innerHTML = `<div class="${
      this.innerElementClass
    }" data-state="${this.defaultState}"></div>`;

    this.container.appendChild(this.element);

    // Listen for events to modify cursor

    this.setMousePosition = this.setMousePosition.bind(this);
    window.addEventListener("mousemove", this.setMousePosition, false);

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
    this.mousePosition.x = e.clientX;
    this.mousePosition.y = e.clientY;
  }

  animate() {
    this.element.style[this.transformProperty] = `translate3d(${
      this.mousePosition.x
    }px, ${this.mousePosition.y}px, 0)`;
  }

  onMouseOver(e) {
    if (this.element.hasAttribute("data-hiding")) {
      this.element.removeAttribute("data-hiding");
    }

    if (e.target.hasAttribute("data-cursor")) {
      this.element.setAttribute(
        "data-state",
        e.target.getAttribute("data-cursor")
      );
    }
  }

  onMouseOut(e) {
    if (e.relatedTarget === null) {
      this.element.setAttribute("data-hiding", "");
    }
  }

  onMouseDown(e) {
    this.element.setAttribute("data-activity", "holding");
  }

  onMouseUp(e) {
    this.element.removeAttribute("data-activity");
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
