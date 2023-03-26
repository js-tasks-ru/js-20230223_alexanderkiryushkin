export default class ColumnChart {
  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = el => el,

  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;
    this.render();
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
    ${this.getFullChart()}
    </div>
    `;
  }

  render() {
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = this.renderFullTemplate();
    this.element = tempWrapper.firstElementChild;
  }


  update(updatedData) {
    this.data = updatedData;
    this.render();
  }

  remove() {
    this.element.remove();
  }


  destroy() {
    this.remove();
  }
}
