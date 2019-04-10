import Component from './component';
import getChart from './get-chart';

export default class Statistic extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._formatter = data.formatter;
    this._data = data.data;

    this._onUpdate = null;
    this._ctx = null;
    this._chart = null;
    this._statsButtonElement = null;
    this._onStatsButtonClickBound = this._onStatsButtonClick.bind(this);
  }

  _onStatsButtonClick() {
    return typeof this._onUpdate === `function` && this._onUpdate();
  }

  get template() {
    return `<div class="statistic__item statistic__item--${this._title.toLowerCase()}">
    <canvas class="statistic__${this._title.toLowerCase()}" width="900"></canvas>
  </div>`;
  }

  bind() {
    this._ctx = this.element.querySelector(`canvas`);
    this._chart = getChart(this._ctx, {title: this._title, data: this._data, formatter: this._formatter});

    this._statsButtonElement = document.querySelector(`nav.trip-controls__menus a:nth-child(2)`);
    this._statsButtonElement.addEventListener(`click`, this._onStatsButtonClickBound);
  }

  unbind() {
    this._chart.destroy();
    this._ctx = null;

    this._statsButtonElement.removeEventListener(`click`, this._onStatsButtonClickBound);
    this._statsButtonElement = null;
  }
}
