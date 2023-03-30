class Tooltip {
  text = '';
  static sample;


  constructor() {
    if (!Tooltip.sample) {
      Tooltip.sample = this;
    } else {
      return Tooltip.sample;
    }
    this.shiftX = 50;
    this.shiftY = 10;
    this.render();
  }

  renderTemplate() {
    return `
    <div class="tooltip">${this.text}</div>
    `;
  }


  createTemplate(str) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.renderTemplate();
    this.element = wrapper.firstElementChild;
    this.element.textContent = str;
    document.body.append(this.element);
  }

  render() {
    this.createTemplate();
  }


  moveTooltip = (event) => {
    this.element.style.left = `${Math.round(event.clientX + this.shiftX)}px`;
    this.element.style.top = `${Math.round(event.clientY + this.shiftY)}px`;
  }


  showTooltip = (event) => {
    if (!event.target.dataset.tooltip) {
      return;
    }
    this.initialize();
    this.createTemplate(event.target.dataset.tooltip);
    this.element.style.left = `${Math.round(event.clientX + this.shiftX)}px`;
    this.element.style.top = `${Math.round(event.clientY + this.shiftY)}px`;
    document.addEventListener('pointermove', this.moveTooltip);

  }


  hideTooltip = () => {
    this.remove();
  }


  remove() {
    document.removeEventListener('pointerover', this.showTooltip);
    document.removeEventListener('pointerout', this.hideTooltip);
    this.element.remove();
  }


  destroy() {
    this.remove();
  }


  initialize() {
    document.addEventListener('pointerover', this.showTooltip);
    document.addEventListener('pointerout', this.hideTooltip);

  }
}

export default Tooltip;

