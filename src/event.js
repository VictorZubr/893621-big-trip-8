import {MILLISECONDS_IN_MINUTE, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_DAY} from "./const";
import {createElement} from './utils';

export default class Event {
  constructor(data) {
    this._type = data.type;
    this._title = data.title;
    this._offers = data.offers;
    this._price = data.price;
    this._dateBegin = data.dateBegin;
    this._dateEnd = data.dateEnd;

    this._element = null;
    this._onEdit = null;
    this._onEditButtonClickBound = this._onEditButtonClick.bind(this);
  }

  _getDuration(ms) {
    const days = Math.floor(ms / MILLISECONDS_IN_DAY);
    const hours = Math.floor((ms - days * MILLISECONDS_IN_DAY) / MILLISECONDS_IN_HOUR);
    const minutes = Math.floor((ms - days * MILLISECONDS_IN_DAY - hours * MILLISECONDS_IN_HOUR) / MILLISECONDS_IN_MINUTE);
    return {days, hours, minutes};
  }

  _getFormattedDate(ms) {
    const date = new Date(ms);
    return `${date.toLocaleString(`en-US`, {day: `2-digit`})} ${date.toLocaleString(`en-US`, {month: `long`})}`;
  }

  _getFormattedDuration(ms) {
    const duration = this._getDuration(ms);
    return [[duration.days, `d`], [duration.hours, `h`], [duration.minutes, `m`]]
      .map((element) => (element[0]) ? `${element[0]}${element[1]} ` : ``).join(``);
  }

  _getFormattedTime(ms) {
    return `${(new Date(ms)).toLocaleString(`en-US`, {hour12: false, hour: `2-digit`, minute: `2-digit`})}`;
  }

  _getFormattedTimetable() {
    return (this._getDuration(this._dateEnd - this._dateBegin).days > 0) ?
      `${this._getFormattedDate(this._dateBegin)} ${this._getFormattedTime(this._dateEnd)}&nbsp;&mdash; ${this._getFormattedDate(this._dateEnd)} ${this._getFormattedTime(this._dateEnd)}` :
      `${this._getFormattedTime(this._dateBegin)}&nbsp;&mdash; ${this._getFormattedTime(this._dateEnd)}`;
  }

  _getOffersHTML() {
    return this._offers
      .map((element) => `<li><button class="trip-point__offer">${element.name} +&euro;&nbsp;${element.price}</button></li>`)
      .join(``);
  }

  _onEditButtonClick() {
    return typeof this._onEdit === `function` && this._onEdit();
  }

  get element() {
    return this._element;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${this._type.icon}</i>
          <h3 class="trip-point__title">${this._title}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${this._getFormattedTimetable(this._dateBegin, this._dateEnd)}</span>
            <span class="trip-point__duration">
                ${this._getFormattedDuration(this._dateEnd - this._dateBegin)}
            </span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${this._getOffersHTML()}
          </ul>
        </article>`;
  }

  bind() {
    this._element.addEventListener(`click`, this._onEditButtonClickBound);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }
  unbind() {
    this._element.removeEventListener(`click`, this._onEditButtonClickBound);
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
