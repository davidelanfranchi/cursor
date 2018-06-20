(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.cursor = factory());
}(this, (function () { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  Cursor

var Cursor = function () {
  function Cursor(options) {
    var _this = this;

    _classCallCheck(this, Cursor);

    // Default options

    var defaults = {
      name: "cursor",
      mousePosition: { x: 0, y: 0 },
      container: document.body,
      containerPosition: { x: 0, y: 0 },
      elementClass: "cursor",
      innerElementClass: "cursor__inner",
      defaultType: "default"
    };

    // Override with initialization options

    var opts = Object.assign({}, defaults, options);
    Object.keys(defaults).forEach(function (prop) {
      _this[prop] = opts[prop];
    });

    // Utility

    this.transformProperty = this.getTransformProperty();

    // Init

    this.init();
  }

  _createClass(Cursor, [{
    key: "init",
    value: function init() {
      // Add container class - use it to hide real cursor

      this.container.classList.add("js-has-cursor");

      // Create cursor element

      this.element = document.createElement("div");
      this.element.classList.add(this.elementClass);
      this.element.setAttribute("data-cursor-type", this.defaultType);
      this.element.innerHTML = "<div class=\"" + this.innerElementClass + "\"></div>";

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
  }, {
    key: "destroy",
    value: function destroy() {
      window.removeEventListener("mousemove", this.setMousePosition, false);
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      this.raf = window.requestAnimationFrame(function () {
        _this2.animate();
        _this2.start();
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.raf) {
        window.cancelAnimationFrame(this.raf);
      }
    }
  }, {
    key: "setMousePosition",
    value: function setMousePosition(e) {
      this.updateContainerPosition();

      this.mousePosition.x = e.clientX - this.containerPosition.x;
      this.mousePosition.y = e.clientY - this.containerPosition.y;
    }
  }, {
    key: "updateContainerPosition",
    value: function updateContainerPosition() {
      var el = this.container;
      console.log(el.clientTop);
      this.containerPosition.x = el.offsetLeft - el.scrollLeft + el.clientLeft;
      this.containerPosition.y = el.offsetTop - el.scrollTop + el.clientTop;
    }
  }, {
    key: "animate",
    value: function animate() {
      this.element.style[this.transformProperty] = "translate3d(" + this.mousePosition.x + "px, " + this.mousePosition.y + "px, 0)";
    }
  }, {
    key: "onMouseOver",
    value: function onMouseOver(e) {
      if (this.element.hasAttribute("data-cursor-hiding")) {
        this.element.removeAttribute("data-cursor-hiding");
      }

      if (e.target.hasAttribute("data-cursor-type")) {
        this.element.setAttribute("data-cursor-type", e.target.getAttribute("data-cursor-type"));
      }
    }
  }, {
    key: "onMouseOut",
    value: function onMouseOut(e) {
      if (e.relatedTarget === null) {
        this.element.setAttribute("data-cursor-hiding", "");
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(e) {
      this.element.setAttribute("data-cursor-state", "holding");
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      this.element.removeAttribute("data-cursor-state");
    }
  }, {
    key: "getTransformProperty",
    value: function getTransformProperty() {
      var testEl = document.createElement("div");
      if (testEl.style.transform === null) {
        var vendors = ["Webkit", "Moz", "ms"];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = vendors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var vendor = _step.value;

            if (testEl.style[vendors[vendor] + "Transform"] !== undefined) {
              return vendors[vendor] + "Transform";
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      return "transform";
    }
  }]);

  return Cursor;
}();

window.Cursor = Cursor;

return Cursor;

})));
