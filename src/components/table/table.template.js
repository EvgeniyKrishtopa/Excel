const CODES = {
  A: 65,
  Z: 90,
};

function toCell(row) {
  return function (col) {
    return `
      <div class="cell" 
      contenteditable 
      data-ceil-title="${col}"
      data-id="${row}:${col}"
      data-type="cell"
      ></div>`;
  };
}

function toColumn(col, index) {
  return `
    <div class="column" data-type="resizable" data-column-title="${index}">
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `;
}

function createRow(index, content) {
  const resize = index
    ? '<div class="row-resize" data-resize="row"></div>'
    : "";
  return `
    <div class="row" data-type="resizable">
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

export function createTable(rowsCount = 15) {
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
    .fill("")
    .map(toChar)
    .map((col, index) => toColumn(col, index))
    .join("");

  rows.push(createRow(null, cols));

  for (let i = 0; i < rowsCount; i++) {
    const cells = new Array(colsCount)
      .fill("")
      .map((_, index) => index)
      .map(toCell(i))
      .join("");

    rows.push(createRow(i + 1, cells));
  }

  return rows.join("");
}
