import { ExcelComponent } from "../../core/ExcelComponent";
import { createTable } from "./table.template";
import { tableResizeHandler } from "./table.resize";

export class Table extends ExcelComponent {
  static className = "excel__table";

  constructor($root) {
    super($root, {
      listeners: ["mousedown"],
    });
  }

  toHTML() {
    return `${createTable(20)}`;
  }

  onMousedown(event) {
    const resizeType = event.target.dataset.resize;
    if (resizeType) {
      tableResizeHandler(event, this.$root, resizeType);
    }
  }
}
