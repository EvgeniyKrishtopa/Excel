import { ExcelComponent } from "../../core/ExcelComponent";
import { changeTableTitle } from "../../redux/actions";
import { getCurrentDate } from "../../core/utils";
import { ActiveRoute } from "../../core/routes/ActiveRoute";

export class Header extends ExcelComponent {
  static className = "excel__header";

  constructor($root, options) {
    super($root, {
      name: "header",
      listeners: ["input", "click"],
      subscribe: ["tableTitle"],
      ...options,
    });

    this.date = getCurrentDate();
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

      <button class="button">
        <i data-stamp="delete-table" class="material-icons">delete</i>
      </button>

      <button class="button">
        <i class="material-icons">exit_to_app</i>
      </button>

    </div>`;
  }

  onInput(event) {
    this.$dispatch(changeTableTitle(event.target.value));
  }

  onClick(event) {
    if (event.target.dataset.stamp === "delete-table") {
      localStorage.removeItem(`excel: ${ActiveRoute.param}`);
    }

    ActiveRoute.navigate("/");
  }
}
