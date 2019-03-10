import Component from './component';

export default class TripHeader extends Component {
  constructor(data) {
    super();
    this._route = data.route;
    this._dateBegin = data.dateBegin;
    this._dateEnd = data.dateEnd;
    this._total = data.total;
  }

  _getFormattedDate(ms) {
    const date = new Date(ms);
    return `${date.toLocaleString(`en-US`, {month: `long`})} ${date.toLocaleString(`en-US`, {day: `2-digit`})}`;
  }

  _getSecondFormattedDate(begin, end) {
    const date = new Date(end);
    return (new Date(begin).getMonth() === date.getMonth()) ? `${date.toLocaleString(`en-US`, {day: `2-digit`})}` : this._getFormattedDate(end);
  }

  get template() {
    return `<section class="trip">
            <div class="trip__schedule">
                <i class="trip-icon">⛰️</i>
                <h1 class="trip__points">${this._route.join(` - `)}</h1>
                <p class="trip__dates">${this._getFormattedDate(this._dateBegin)}&nbsp;&mdash; ${this._getSecondFormattedDate(this._dateBegin, this._dateEnd)}</p>
            </div>
            <p class="trip__total">Total: <span class="trip__total-cost">&euro;&nbsp;${this._total}</span></p>
        </section>`;
  }
}
