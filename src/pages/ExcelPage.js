import { Page } from "@/core/page";
import { Excel } from "@/components/excel/Excel";
import { Header } from "@/components/header/Header";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { Formula } from "@/components/formula/Formula";
import { Table } from "@/components/table/Table";
import { createStore } from "@/core/store/createStore";
import { rootReducer } from "@/redux/rootReducer";
import { storage, debounce } from "@/core/utils";
import { getCurrentDate } from "../core/utils";

function storageName(param) {
  return `excel: ${param}`;
}

export class ExcelPage extends Page {
  constructor(params) {
    super(params);
    this.params = params;
    this.data = getCurrentDate();
    this.storeSub = null;
  }

  getRoot() {
    const params = this.params ? this.params : this.data;
    const store = createStore(rootReducer, storage(storageName(params)));

    const stateListener = debounce(
      (state) => storage(storageName(params), state),
      300
    );

    this.storeSub = store.subscribe(stateListener);
    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store,
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
    this.storeSub = null;
  }
}
