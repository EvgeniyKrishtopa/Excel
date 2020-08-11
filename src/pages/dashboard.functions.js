export function toHTML(item, key) {
  return `
   <li class="db__record">
     <a href="${setUrl(key)}">${setTitle(item)}</a>
     <strong>${setCurrentData(key)}</strong>
   </li>
   `;
}

function setTitle(item) {
  const { tableTitle } = JSON.parse(item);
  const title = tableTitle ? tableTitle : "Unknown Table";
  return `${title}`;
}

function setCurrentData(key) {
  const data = key.slice(6);
  const year = new Date(+data).getFullYear();
  let month = new Date(+data).getMonth();
  month = month < 10 ? `0${month}` : month;
  let day = new Date(+data).getDate();
  day = day < 10 ? `0${day}` : day;
  return `${day}.${month}.${year}`;
}

function setUrl(key) {
  if (process.env.NODE_ENV === "production") {
    return `Excel/#excel/${key.slice(7)}`;
  }
  return `/#excel/${key.slice(7)}`;
}

function getAllKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.includes("excel")) {
      continue;
    }
    keys.push(key);
  }

  return keys;
}

export function createRecordsTable() {
  const keys = getAllKeys();

  if (!keys) {
    return `<p>You have not created any table!</p>`;
  }

  return `
  <div class="db__list-header">
    <span>Title</span>
     <span>Date Creation</span>
  </div>

  <ul class="db__list">
    ${keys
      .map((item, index) => toHTML(localStorage.getItem(item), keys[index]))
      .join("")}
  </ul>`;
}
