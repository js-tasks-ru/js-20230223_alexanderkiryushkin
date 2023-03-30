export default class SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;


    this.render();
  }


  getFullTable() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          ${this.renderTableHeader()}
          ${this.renderTableBody()}
        </div>
      </div>
    `;
  }


  renderTableHeader() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map((item) => this.renderHeaderRow(item)).join("")}
    </div>`;
  }


  renderHeaderRow({
    id,
    title,
    sortable
  }) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }


  renderTableBody() {
    return `
    <div data-element="body" class="sortable-table__body">
    ${this.renderTableRows(this.data)};
    </div>`;
  }


  renderTableRows(data) {
    return data.map((item) => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
        ${this.renderTableRow(item)}
        </a>`;
    })
      .join("");
  }


  renderTableRow(item) {
    return this.headersConfig.map(({
      id,
      template
    }) => (
      template ? template(item[id]) : ` <div class="sortable-table__cell">${item[id]}</div>`
    )).join("");

  }


  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll(
      ".sortable-table__cell[data-id]"
    );
    const currentColumn = this.element.querySelector(
      `.sortable-table__cell[data-id="${field}"]`
    );


    allColumns.forEach((column) => {
      column.dataset.order = "";
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.renderTableRows(sortedData);
  }


  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find((item) => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1,
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
      case "number":
        return direction * (a[field] - b[field]);
      case "string":
        return direction * a[field].localeCompare(b[field], ["ru", "en"]);
      default:
        return direction * (a[field] - b[field]);
      }
    });
  }


  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }


  clickForSorting = (event) => {
    const item = event.target.closest(`[data-sortable="true"]`);
    if (item.dataset.sortable === 'false') return;
    if (item.dataset.sortable === 'true') {
      const order = item.dataset.order === 'desc' ? 'asc' : 'desc';
      this.sort(item.dataset.id, order);
    }
  }


  initEventListeners() {
    document.addEventListener("pointerdown", this.clickForSorting);
  }

  render() {
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = this.getFullTable();
    const element = tempWrapper.firstElementChild;
    this.element = element;

    this.subElements = this.getSubElements(element);

    this.initEventListeners();
  }


  update(data) {
    this.data = data;
    this.subElements.body.innerHTML = this.renderTableHeader(data);
  }


  remove() {
    this.element.remove();
  }


  destroy() {
    this.remove();
  }
}
