import Component from './component';
import getChart from './get-chart';

export default class Statistic extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._formatter = data.formatter;
    this._data = data.data;

    this._ctx = null;
    this._chart = null;
  }

  get template() {
    const joinedTitle = this._title.toLowerCase().split(` `).join(`-`);
    return `<div class="statistic__item statistic__item--${joinedTitle}">
    <canvas class="statistic__${joinedTitle}" width="900"></canvas>
  </div>`;
  }

  bind() {
    this._ctx = this.element.querySelector(`canvas`);
    this._chart = getChart(this._ctx, {title: this._title, data: this._data, formatter: this._formatter});
  }

  unbind() {
    this._chart.destroy();
    this._ctx = null;
  }
}
