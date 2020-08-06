import { $ } from "@core/dom";
import { createToolbar } from "./toolbar.template";
import { ExcelStateComponent } from "../../core/ExcelStateComponent";
import { defaultStyles } from "../../constants";

export class Toolbar extends ExcelStateComponent {
  static className = "excel__toolbar";

  constructor($root, options) {
    super($root, {
      name: "toolbar",
      listeners: ["click"],
      subscribe: ["toolsState", "currentStyles"],
      ...options,
    });
  }

  init() {
    super.init();
  }

  storeChanged({ currentStyles }) {
    this.setState(currentStyles);
  }

  prepare() {
    this.initState(defaultStyles);
  }

  get template() {
    return createToolbar(this.state);
  }

  toHTML() {
    return this.template;
  }

  onClick(event) {
    const $target = $(event.target);
    if ($target.$el.attributes["data-type"].nodeValue === "button") {
      const value = JSON.parse($target.$el.attributes["data-value"].nodeValue);
      this.$emit("toolbar:applyStyle", value);
    }
  }
}
