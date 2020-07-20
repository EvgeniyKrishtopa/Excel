export function capitalize(str) {
  if (typeof str !== "string") {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function range(start, end) {
  const min = Math.min(start, end);
  const max = Math.max(start, end);

  const rangeArray = [];
  for (let i = min; i <= max; i++) {
    rangeArray.push(i);
  }

  return rangeArray;
}

export function nextSelector(key, col, row) {
  const minValue = 0;

  switch (key) {
    case "Enter":
    case "ArrowDown":
      row++;
      break;
    case "Tab":
    case "ArrowRight":
      col++;
      break;
    case "ArrowLeft":
      col = col - 1 > minValue ? col - 1 : minValue;
      break;
    case "ArrowUp":
      row = col - 1 > minValue ? row - 1 : minValue;
      break;
  }

  return `[data-id="${row}:${col}"]`;
}
