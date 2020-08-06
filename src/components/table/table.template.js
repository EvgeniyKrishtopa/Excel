import { toInlineStyles } from "../../core/utils";
import { defaultStyles } from "../../constants";
import { parse } from "../../core/parse";

const CODES = {
  A: 65,
  Z: 90,
};
const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 24;

function getWidth(state, index) {
  if (state.colState) {
    return state.colState[index] || DEFAULT_WIDTH + "px";
  }
  return DEFAULT_WIDTH + "px";
}

function getHeight(state, index) {
  if (state.rowState) {
    return state.rowState[index] || DEFAULT_HEIGHT + "px";
  }
  return DEFAULT_HEIGHT + "px";
}

function withWidthFrom(state) {
  return function (col, index) {
    return {
      col,
      index,
      width: getWidth(state, index),
    };
  };
}

function toCell(state, row) {
  return function (_, col) {
    const id = `${row}:${col}`;
    const data = state.dataState[id] || "";
    const styles = toInlineStyles({
      ...defaultStyles,
      ...state.stylesState[id],
    });

    return `
      <div class="cell" 
      contenteditable 
      style="width:${getWidth(state, col)};${styles}"
      data-ceil-title="${col}"
      data-id="${id}"
      data-type="cell"
      data-value="${data || ""}"
      >${parse(data)}</div>`;
  };
}

function toColumn({ col, index, width }) {
  return `
    <div class="column" data-type="resizable" 
      data-column-title="${index}" style="width:${width}">
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `;
}

function createRow(index, content, state = {}) {
  const resize = index
    ? '<div class="row-resize" data-resize="row"></div>'
    : "";
  return `
    <div class="row" data-type="resizable"  
    data-row-id=${index} style="height: ${getHeight(state, index)}">
      <div class="row-info">
        ${index ? index : ""}
        ${resize}
      </div>
      <div class="row-data">${content}</div>
    </div>
  `;
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index);
}

export function createTable(rowsCount = 15, state = {}) {
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
    .fill("")
    .map(toChar)
    .map(withWidthFrom(state))
    .map(toColumn)
    .join("");

  rows.push(createRow(null, cols));

  for (let i = 0; i < rowsCount; i++) {
    const cells = new Array(colsCount).fill("").map(toCell(state, i)).join("");

    rows.push(createRow(i + 1, cells, state));
  }

  return rows.join("");
}
