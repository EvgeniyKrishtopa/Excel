class Dom {
  constructor(selector) {
    this.$el =
      typeof selector === "string"
        ? document.getElementById(selector)
        : selector;
  }

  html(html) {
    if (typeof html === "string") {
      this.$el.innerHTML = html;
      return this;
    }
    return this.$el.outerHTML.trim();
  }

  text(data) {
    if (typeof data !== "undefined") {
      this.$el.textContent = data;
      return this;
    }

    if (this.$el.tagName.toLowerCase() === "input") {
      return this.$el.value.trim();
    }

    return this.$el.textContent.trim();
  }

  clear() {
    this.html("");
    return this;
  }

  on(eventType, callback) {
    this.$el.addEventListener(eventType, callback);
  }

  off(eventType, callback) {
    this.$el.removeEventListener(eventType, callback);
  }

  find(selector) {
    return $(this.$el.querySelector(selector));
  }

  addClass(className) {
    this.$el.classList.add(className);
  }

  removeClass(className) {
    this.$el.classList.remove(className);
  }

  id(parse) {
    if (parse) {
      const parsed = this.id().split(":");

      return {
        row: +parsed[0],
        col: +parsed[1],
      };
    }
    return this.$el.dataset.id;
  }

  focus() {
    this.$el.focus();
    return this;
  }

  append(node) {
    if (node instanceof Dom) {
      node = node.$el;
    }
    if (Element.prototype.append) {
      this.$el.append(node);
    } else {
      this.$el.appendChild(node);
    }
    return this;
  }

  getParentNode(node) {
    return $(node.$el.closest('[data-type = "resizable"]'));
  }

  findAll(selector) {
    return this.$el.querySelectorAll(selector);
  }

  attr(node) {
    return node.$el.getAttribute("data-column-title");
  }

  attribute(name, val) {
    if (val) {
      this.$el.setAttribute(name, val);
      return this;
    }

    return this.$el.getAttribute(name);
  }

  getCoords() {
    return this.$el.getBoundingClientRect();
  }

  css(styles = {}) {
    Object.keys(styles).forEach((key) => {
      this.$el.style[key] = styles[key];
    });

    return this;
  }

  getStyles(styles = []) {
    return styles.reduce((res, s) => {
      res[s] = this.$el.style[s];
      return res;
    }, {});
  }
}

export function $(selector) {
  return new Dom(selector);
}

$.create = (tagName, classes = "") => {
  const el = document.createElement(tagName);
  if (classes) {
    el.classList.add(classes);
  }
  return $(el);
};
