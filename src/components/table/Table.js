import { ExcelComponent } from "../../core/ExcelComponent";
import { createTable } from "./table.template";
import { tableResizeHandler } from "./table.resize";
import { $ } from "@core/dom";
import { TableSelection } from "./Tableselection";
import { range, nextSelector } from "../../core/utils";

export class Table extends ExcelComponent {
  static className = "excel__table";

  constructor($root, options) {
    super($root, {
      name: "table",
      listeners: ["mousedown", "keydown", "input"],
      ...options,
    });
  }

  toHTML() {
    return `${createTable(20)}`;
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();

    this.selectCell(this.$root.find('[data-id="0:0"]'));

    this.$on("formula:input", (data) => {
      this.selection.current.text(data);
    });

    this.$on("formula:done", () => {
      this.selection.current.focus();
    });
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit("table:select", $cell);
  }

  onMousedown(event) {
    const dataType = event.target.dataset;
    const $target = $(event.target);

    if (dataType.resize) {
      tableResizeHandler(event, this.$root, dataType.resize, $target);
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
        this.selection.select($target);
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

  onInput(event) {
    this.$emit("table:input", $(event.target).text());
  }
}
