import { Page } from "../core/page";
import { $ } from "../core/dom";
import { createRecordsTable } from "./dashboard.functions";
import { getCurrentDate } from "../core/utils";

export class DashboardPage extends Page {
  getRoot() {
    return $.create("div", "db").html(`

    <div class="db__header">
      <h1>Excel Dashboard</h1>
    </div>

    <div class="db__new">
      <div class="db__view">
        <a href="#excel/${getCurrentDate()}" class="db__create">
          New  <br /> Table
        </a>
      </div>
    </div>

    <div class="db__table db__view">
      ${createRecordsTable()}
    </div>
    `);
  }
}
