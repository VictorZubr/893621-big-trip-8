import Component from './component';
import getChart from './get-chart';

export default class Statistic extends Component {
  constructor(){
    super();
    this._moneyStatistic = null;
    this._moneyChart = null;
  }

  get template() {
    return `<section class="statistic content-wrap visually-hidden" id="stats">
  <div class="statistic__item statistic__item--money">
    <canvas class="statistic__money" width="900"></canvas>
  </div>

  <div class="statistic__item statistic__item--transport">
    <canvas class="statistic__transport" width="900"></canvas>
  </div>

  <div class="statistic__item statistic__item--time-spend">
    <canvas class="statistic__time-spend" width="900"></canvas>
  </div>
</section>`;
  }

  bind() {
    this._moneyCtx = this.element.querySelector(`.statistic__money`);
    this._moneyChart = getChart(this._moneyCtx, {});
  }
}