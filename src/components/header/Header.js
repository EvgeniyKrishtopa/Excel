import { ExcelComponent } from "../../core/ExcelComponent";
import { changeTableTitle } from "../../redux/actions";

export class Header extends ExcelComponent {
  static className = "excel__header";

  constructor($root, options) {
    super($root, {
      name: "header",
      listeners: ["input"],
      subscribe: ["tableTitle"],
      ...options,
    });
  }

  init() {
    super.init();
    this.$header = this.$root.find(".input");
  }

  storeChanged(state) {
    this.$header.text(state.tableTitle);
  }

  getCurrentValue() {
    const state = this.store.getState();
    return state.tableTitle || "New Table";
  }

  toHTML() {
    return `      
    <input type="text" class="input" value="${this.getCurrentValue()}" />

    <div>

      <div class="button">
        <i class="material-icons">delete</i>
      </div>

      <div class="button">
        <i class="material-icons">exit_to_app</i>
      </div>

    </div>`;
  }

  onInput(event) {
    this.$dispatch(changeTableTitle(event.target.value));
  }
}
