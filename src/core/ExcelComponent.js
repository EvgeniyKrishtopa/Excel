import { DOMListener } from "./DOMListener";

export class ExcelComponent extends DOMListener {
  constructor($root, options = {}) {
    super($root, options.listeners);

    this.name = options.name || "";
    this.emitter = options.emitter;
    this.store = options.store;
    this.unsubscribers = [];
    this.subscribe = options.subscribe || [];

    this.prepare();
  }

  prepare() {}

  toHTML() {
    return "";
  }

  $dispatch(action) {
    this.store.dispatch(action);
  }

  isWatching(key) {
    return this.subscribe.includes(key);
  }

  $emit(event, ...args) {
    this.emitter.emit(event, ...args);
  }

  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn);
    this.unsubscribers.push(unsub);
  }

  storeChanged() {}

  init() {
    this.initDOMListeners();
  }

  destroy() {
    this.removeDOMListeners();
    this.unsubscribers.forEach((unsub) => unsub());
  }
}
