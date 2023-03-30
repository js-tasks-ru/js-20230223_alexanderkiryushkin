import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = el => el,
    range = {},
    url = '',
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;
    this.subElements = {};
    this.url = url;
    this.range = range;
    this.render();
    this.update(this.range.from, this.range.to);
  }


  getSubElements(element) {
    let result = {};
    const elements = element.querySelectorAll("[data-element]");
    for (const elem of elements) {
      const name = elem.dataset.element;
      result[name] = elem;
    }
    return result;
  }


  getLoadingClass() {
    return (this.data.length > 0) ? "" : "column-chart_loading";
  }


  renderFullTemplate() {
    return `
    <div class="column-chart ${this.getLoadingClass()}" style="--chart-height: ${this.chartHeight}">
    ${this.getChartTitle()}
    ${this.renderChart()}
    </div>
  `;
  }


  getChartTitle() {
    return `
    <div class="column-chart__title">
    ${this.label}
    ${this.link && `<a href="/${this.link}" class="column-chart__link">View all</a>`}
    </div>
    `;
  }


  getChartHeader() {
    return `
    <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
    `;
  }


  getColumns() {
    if (!this.data || this.data.length === 0) return `<img src="./charts-skeleton.svg" alt="Дашборд пустой"/>`;

    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      const percent = (item / maxValue * 100).toFixed(0) + '%';
      const value = String(Math.floor(item * scale));

      return `
      <div style="--value:${value}" data-tooltip="${percent}"></div>
`;
    }).join('');

  }


  getFullChart() {
    return `<div data-element="body" class="column-chart__chart">${this.getColumns()}</div>`;
  }


  renderChart() {
    return `
    <div class="column-chart__container">
    ${this.getChartHeader()}
    ${this.getFullChart(this.data)}
    </div>
    `;
  }


  render() {
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = this.renderFullTemplate();
    this.element = tempWrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }


  async loadData(from, to) {
    const url = `${BACKEND_URL}/${this.url}?from=${from}&to=${to}`;
    let response;
    try {
      response = await fetchJson(url);
    } catch (e) {
      throw new Error(`Error load ${e}`);
    }

    return response;
  }


  async update(from, to) {

    const data = await this.loadData(from, to);

    this.data = Object.values(data);
    if (this.data.length) {
      this.renderNewData();
    }

    return data;
  }


  renderNewData() {
    this.element.classList.remove("column-chart_loading");
    this.value = this.data.reduce((a, b) => (a + b));
    this.subElements.header.innerHTML = this.formatHeading(this.value);
    this.subElements.body.innerHTML = this.getColumns(this.data);
  }


  remove() {
    this.element.remove();
  }


  destroy() {
    this.remove();
  }
}
