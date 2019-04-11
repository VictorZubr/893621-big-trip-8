import Component from './component';
import {createComponentElement} from "./utils";

export default class Header extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._dateBegin = data.dateBegin;
    this._dateEnd = data.dateEnd;
    this._total = data.total;
  }

  get template() {
    return `<section class="trip">
            <div class="trip__schedule">
                <i class="trip-icon">⛰️</i>
                <h1 class="trip__points">${this._title}</h1>
                <p class="trip__dates">${Header.getFormattedDate(this._dateBegin)}&nbsp;&mdash; ${Header.getSecondFormattedDate(this._dateBegin, this._dateEnd)}</p>
            </div>
            <p class="trip__total">Total: <span class="trip__total-cost">&euro;&nbsp;${this._total}</span></p>
        </section>`;
  }

  update(data) {
    this._title = data.title;
    this._dateBegin = data.dateBegin;
    this._dateEnd = data.dateEnd;
    this._total = data.total;
    this._partialUpdate();
  }

  _partialUpdate() {
    this.unbind();
    this._element.innerHTML = createComponentElement(this.template).innerHTML;
    this.bind();
  }

  static getFormattedDate(ms) {
    const date = new Date(ms);
    return `${date.toLocaleString(`en-US`, {month: `long`})} ${date.toLocaleString(`en-US`, {day: `2-digit`})}`;
  }

  static getSecondFormattedDate(begin, end) {
    const date = new Date(end);
    return (new Date(begin).getMonth() === date.getMonth()) ? `${date.toLocaleString(`en-US`, {day: `2-digit`})}` : Header.getFormattedDate(end);
  }
}
