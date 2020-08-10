export class Page {
  constructor(params) {
    this.params = params;
  }

  getRoot() {
    throw new Error('Create method getRoot in your page component!')
  }

  afterRender() {}

  destroy() {}
}
