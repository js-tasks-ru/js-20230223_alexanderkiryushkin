export default class NotificationMessage {

  static notifyShow;

  constructor(message, {
    duration,
    type
  } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.template = `
    <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      ${this.getNotifyHeader()}
      ${this.getNotifyBody()}
      </div>
    </div>
    `;

    this.showOnlyOneNotify();
    this.render();
  }


  getNotifyHeader() {
    return `
  <div class="notification-header">
  ${this.type}
  </div>
  `;
  }


  getNotifyBody() {
    return `
    <div class="notification-body">
    ${this.message}
  </div>
    `;
  }


  showOnlyOneNotify() {
    if (NotificationMessage.notifyShow) {
      NotificationMessage.notifyShow.remove();
    }
  }


  render() {
    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = this.template;
    this.element = tempWrapper.firstElementChild;
    NotificationMessage.notifyShow = this.element;
  }


  show(target = document.body) {
    target.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }


  remove() {
    this.element.remove();
  }


  destroy() {
    this.remove();
  }
}
