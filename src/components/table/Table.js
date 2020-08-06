import { ExcelStateComponent } from "../../core/ExcelStateComponent";
import { createTable } from "./table.template";
import { tableResizeHandler } from "./table.resize";
import { $ } from "@core/dom";
import { TableSelection } from "./Tableselection";
import { range, nextSelector } from "../../core/utils";
import {
  tableResize,
  changeText,
  changeStyles,
  applyStyle,
} from "../../redux/actions";
import { defaultStyles } from "../../constants";
import { parse } from "../../core/parse";

export class Table extends ExcelStateComponent {
  static className = "excel__table";

  constructor($root, options) {
    super($root, {
      name: "table",
      listeners: ["mousedown", "keydown", "input"],
      subscribe: ["toolsState"],
      ...options,
    });
  }

  toHTML() {
    return createTable(20, this.store.getState());
  }

  prepare() {
    this.selection = new TableSelection();
  }

  storeChanged({ toolsState }) {
    console.log(toolsState);
  }

  init() {
    super.init();

    this.selectCell(this.$root.find('[data-id="0:0"]'));

    this.$on("formula:input", (data) => {
      const p = parse(data);
      this.selection.current.attribute("data-value", data).text(p);
      this.updateTextInStore(data);
    });

    this.$on("formula:done", () => {
      this.selection.current.focus();
    });

    this.$on("toolbar:applyStyle", (value) => {
      this.setStyles(value);
      this.$dispatch(
        applyStyle({
          value,
          ids: this.selection.selectedIds,
        })
      );
    });
  }

  setStyles(styles = {}) {
    this.selection.group.forEach(($el) => $el.css(styles));
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit("table:select", $cell);

    const selectedStyles = $cell.getStyles(Object.keys(defaultStyles));
    this.$dispatch(changeStyles(selectedStyles));
  }

  async resizeTable(event, $root, resize, $target) {
    try {
      const data = await tableResizeHandler(event, $root, resize, $target);
      this.$dispatch(tableResize(data));
    } catch (e) {
      console.warn("Resize error", e.message);
    }
  }

  onMousedown(event) {
    const dataType = event.target.dataset;
    const $target = $(event.target);

    if (dataType.resize) {
      this.resizeTable(event, this.$root, dataType.resize, $target);
    } else if (dataType.type === "cell") {
      if (event.shiftKey) {
        const target = $target.id(true);
        const current = this.selection.current.id(true);
        const rows = range(current.row, target.row);
        const cols = range(current.col, target.col);

        const ids = cols.reduce((acc, col) => {
          rows.forEach((row) => acc.push(`${row}:${col}`));
          return acc;
        }, []);

        const cells = ids.map((id) => this.$root.find(`[data-id = "${id}"]`));
        this.selection.selectGroup(cells);
      } else {
        this.selectCell($target);
      }
    }
  }

  onKeydown(event) {
    const keys = [
      "Enter",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];
    const { key } = event;

    const { col, row } = this.selection.current.id(true);
    const $next = this.$root.find(nextSelector(key, col, row));

    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();

      this.selectCell($next);
    }
  }

  updateTextInStore(text) {
    this.$dispatch(
      changeText({
        id: this.selection.current.id(),
        text,
      })
    );
  }

  onInput(event) {
    this.updateTextInStore($(event.target).text());
  }
}
