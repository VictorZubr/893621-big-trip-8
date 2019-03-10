import {MILLISECONDS_IN_MINUTE, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_DAY, ADDITIONAL_POINTS} from "./const";
import Componenet from './component';

export default class EventEdit extends Componenet {
  constructor(data) {
    super();
    this._type = data.type;
    this._title = data.title;
    this._tripRoute = data.tripRoute;
    this._photos = data.photos;
    this._offers = data.offers;
    this._destination = data.destination;
    this._price = data.price;
    this._isFavorite = data.isFavorite;
    this._dateBegin = data.dateBegin;
    this._dateEnd = data.dateEnd;

    this._formElement = null;
    this._onSubmit = null;
    this._onReset = null;
    this._onFormSubmitBound = this._onFormSubmit.bind(this);
    this._onFormResetBound = this._onFormReset.bind(this);
  }

  _getDuration(ms) {
    const days = Math.floor(ms / MILLISECONDS_IN_DAY);
    const hours = Math.floor((ms - days * MILLISECONDS_IN_DAY) / MILLISECONDS_IN_HOUR);
    const minutes = Math.floor((ms - days * MILLISECONDS_IN_DAY - hours * MILLISECONDS_IN_HOUR) / MILLISECONDS_IN_MINUTE);
    return {days, hours, minutes};
  }

  _getFormattedDate(ms) {
    const date = new Date(ms);
    return `${date.toLocaleString(`en-US`, {month: `short`})} ${date.toLocaleString(`en-US`, {day: `2-digit`})}`;
  }

  _getFormattedTime(ms) {
    return `${(new Date(ms)).toLocaleString(`en-US`, {hour12: false, hour: `2-digit`, minute: `2-digit`})}`;
  }

  _getFormattedTimetable() {
    return (this._getDuration(this._dateEnd - this._dateBegin).days > 0) ?
      `${this._getFormattedDate(this._dateBegin)} ${this._getFormattedTime(this._dateEnd)}&nbsp;&mdash; ${this._getFormattedDate(this._dateEnd)} ${this._getFormattedTime(this._dateEnd)}` :
      `${this._getFormattedTime(this._dateBegin)}&nbsp;&mdash; ${this._getFormattedTime(this._dateEnd)}`;
  }

  _getOfferId(offer) {
    return offer.toLowerCase().replace(/\s/g, `-`);
  }

  _getOffersHTML() {
    return this._offers
      .map((element) =>
        `          <input class="point__offers-input visually-hidden" type="checkbox" id="${this._getOfferId(element.name)}" name="offer" value="add-luggage">
          <label for="${this._getOfferId(element.name)}" class="point__offers-label">
            <span class="point__offer-service">${element.name}</span> + €<span class="point__offer-price">${element.price}</span>
          </label>`)
      .join(``);

  }

  _getDestinationsHTML() {
    return Array.from(new Set(this._tripRoute)).concat(ADDITIONAL_POINTS).map((element) => `<option value="${element}"></option>`).join(``);
  }

  _getDescriptionHTML() {
    return Array.from(this._photos).map((element) => `<img src="${element}" alt="picture from place" class="point__destination-image">`).join(``);
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    return typeof this._onSubmit === `function` && this._onSubmit();
  }

  _onFormReset(evt) {
    evt.preventDefault();
    return typeof this._onReset === `function` && this._onReset();
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onReset(fn) {
    this._onReset = fn;
  }

  get template() {
    return `<article class="point">
  <form action="" method="get">
    <header class="point__header">
      <label class="point__date">
        choose day
        <input class="point__input" type="text" placeholder="${this._getFormattedDate(this._dateBegin)}" name="day">
      </label>

      <div class="travel-way">
        <label class="travel-way__label" for="travel-way__toggle">${this._type.icon}️</label>

        <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

        <div class="travel-way__select">
          <div class="travel-way__select-group">
            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
            <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
            <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
            <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="train" checked>
            <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
          </div>

          <div class="travel-way__select-group">
            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
            <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

            <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing">
            <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
          </div>
        </div>
      </div>

      <div class="point__destination-wrap">
        <label class="point__destination-label" for="destination">${this._type.name}</label>
        <input class="point__destination-input" list="destination-select" id="destination" value="${this._title}" name="destination">
        <datalist id="destination-select">
            ${this._getDestinationsHTML()}
        </datalist>
      </div>

      <label class="point__time">
        choose time
        <input class="point__input" type="text" value="${this._getFormattedTime(this._dateBegin)}&nbsp;&mdash; ${this._getFormattedTime(this._dateEnd)}" name="time" placeholder="00:00 — 00:00">
      </label>

      <label class="point__price">
        write price
        <span class="point__price-currency">€</span>
        <input class="point__input" type="text" value="${this._price}" name="price">
      </label>

      <div class="point__buttons">
        <button class="point__button point__button--save" type="submit">Save</button>
        <button class="point__button" type="reset">Delete</button>
      </div>

      <div class="paint__favorite-wrap">
        <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
        <label class="point__favorite" for="favorite">favorite</label>
      </div>
    </header>

    <section class="point__details">
      <section class="point__offers">
        <h3 class="point__details-title">offers</h3>

        <div class="point__offers-wrap">
            ${this._getOffersHTML()}

        </div>

      </section>
      <section class="point__destination">
        <h3 class="point__details-title">Destination</h3>
        <p class="point__destination-text">${this._destination}</p>
        <div class="point__destination-images">
            ${this._getDescriptionHTML()}
        </div>
      </section>
      <input type="hidden" class="point__total-price" name="total-price" value="">
    </section>
  </form>
</article>
`;
  }

  bind() {
    this._formElement = this._element.querySelector(`form`);
    this._formElement.addEventListener(`submit`, this._onFormSubmitBound);
    this._formElement.addEventListener(`reset`, this._onFormResetBound);
  }

  unbind() {
    this._formElement.removeEventListener(`submit`, this._onFormSubmitBound);
    this._formElement.removeEventListener(`reset`, this._onFormResetBound);
  }
}
