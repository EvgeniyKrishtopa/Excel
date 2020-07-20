import { ExcelComponent } from "../../core/ExcelComponent";
import { $ } from "@core/dom";

export class Formula extends ExcelComponent {
  static className = "excel__formula";

  constructor($root, options) {
    super($root, {
      name: "formula",
      listeners: ["input", "click", "keydown"],
      ...options,
    });
  }

  toHTML() {
    return `
    <div class="info">fx</div>
    <div class="input" contenteditable spellcheck="false"></div>
    `;
  }

  init() {
    super.init();

    this.$formula = this.$root.find(".input");

    this.$on("table:select", ($cell) => {
      this.$formula.text($cell.text());
    });

    this.$on("table:input", (data) => {
      this.$formula.text(data);
    });
  }

  onInput(event) {
    this.$emit("formula:input", $(event.target).text());
  }

  onKeydown(event) {
    const keys = ["Enter", "Tab"];
    if (keys.includes(event.key)) {
      event.preventDefault();

      this.$emit("formula:done");
    }
  }

  onClick(event) {
    // console.log(event.target);
  }
}
