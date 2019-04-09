import Component from './component';
import moment from 'moment';

export default class Event extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._title = data.title;
    this._offers = data.offers.slice(0);
    this._price = data.price;
    this._dateBegin = data.dateBegin;
    this._dateEnd = data.dateEnd;

    this._index = null;
    this._onEdit = null;
    this._onEditButtonClickBound = this._onEditButtonClick.bind(this);
  }

  _getFormattedDuration(ms) {
    const days = moment.duration(ms).days();
    const months = moment.duration(ms).months();
    const years = moment.duration(ms).years();
    return `${years > 0 ? years + `Y ` : ``}${months > 0 ? months + `M ` : ``}${days > 0 ? days + `D ` : ``}${moment.duration(ms).hours()}H ${moment.duration(ms).minutes()}M`;
  }

  _getFormattedTime(ms) {
    return moment(ms).format(`HH:mm`);
  }

  _getFormattedTimetable(dateBegin, dateEnd) {
    return `${this._getFormattedTime(dateBegin)}&nbsp;&mdash; ${this._getFormattedTime(dateEnd)}`;
  }

  _getOffersHTML() {
    return this._offers
      .filter((it) => it.checked).slice(0, 3)
      .map((element) => `<li><button class="trip-point__offer">${element.name} +&euro; ${element.price}</button></li>`)
      .join(``);
  }

  _onEditButtonClick() {
    return typeof this._onEdit === `function` && this._onEdit();
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

  unbind() {
    this._element.removeEventListener(`click`, this._onEditButtonClickBound);
  }

  update(data) {
    this._type = data.type;
    this._title = data.title;
    this._offers = data.offers.slice(0);
    this._price = data.price;
    this._isFavorite = data.isFavorite;
    this._dateBegin = data.dateBegin;
    this._dateEnd = data.dateEnd;
  }
}
