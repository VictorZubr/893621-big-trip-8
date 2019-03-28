import Component from './component';
import getChart from './get-chart';

export default class Statistic extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._data = data.data;

    this._ctx = null;
    this._chart = null;

  }

  get template() {
    return `<div class="statistic__item statistic__item--${this._title.toLowerCase()}">
    <canvas class="statistic__${this._title.toLowerCase()}" width="900"></canvas>
  </div>`;
  }

  bind() {
    this._ctx = this.element.querySelector(`canvas`);
    this._chart = getChart(this._ctx, {title: this._title, data: this._data});

  }
}
