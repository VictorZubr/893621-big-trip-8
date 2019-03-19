import {MILLISECONDS_IN_MINUTE, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_DAY, ADDITIONAL_POINTS, POINT_TYPES} from "./const";
import Componenet from './component';
import TaskEdit from "../../893621-taskmanager-8/src/task-edit";

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

    this._index = null;

    this._formElement = null;
    this._travelWayToggleElement = null;

    this._onSubmit = null;
    this._onReset = null;
    this._onFormSubmitBound = this._onFormSubmit.bind(this);
    this._onFormResetBound = this._onFormReset.bind(this);
    this._onFormChangeBound = this._onFormChange.bind(this);
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

  _getOfferValue(offer) {
    return offer.toLowerCase().replace(/\s/g, `-`);
  }

  _getOffersHTML() {
    return this._offers
      .map((element) =>
        ` <input class="point__offers-input visually-hidden" type="checkbox" id="${this._getOfferValue(element.name)}-${this._index}" name="offer" value="${this._getOfferValue(element.name)}"${element.checked ? ` checked` : ``}>
          <label for="${this._getOfferValue(element.name)}-${this._index}" class="point__offers-label">
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

  _getTravelWaySelectHTML() {
    const result = POINT_TYPES.sort((a, b) => a.group < b.group);
    result.forEach((element, index, array) => {
      element.oldGroup = index === 0 || element.group === array[index - 1].group;
    });
    return result.map((element) =>
      `${!element.oldGroup ? `</div><div class="travel-way__select-group">` : ``}
       <input class="travel-way__select-input visually-hidden"
            type="radio"
            id="travel-way-${element.name}-${this._index}"
            name="travel-way"
            value="${element.name}">
       <label class="travel-way__select-label" for="travel-way-${element.name}-${this._index}">${element.icon} ${element.name}</label>`
    ).join(``);
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
        <label class="travel-way__label" for="travel-way__toggle-${this._index}">${this._type.icon}</label>

        <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle-${this._index}">

        <div class="travel-way__select">
          <div class="travel-way__select-group">
            ${this._getTravelWaySelectHTML()}
          </div>
        </div>
      </div>

      <div class="point__destination-wrap">
        <label class="point__destination-label" for="destination">${this._type.text}</label>
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

  _onFormChange(evt) {
    if (evt.target.name === `travel-way`) {
      this._type = POINT_TYPES.find((element) => element.name === evt.target.value);
      this._formElement.querySelector(`.point__destination-label`).innerText = this._type.text;
      this._formElement.querySelector(`.travel-way__label`).innerText = this._type.icon;
      this._travelWayToggleElement.click();
    }
  }

  // _processForm(formData) {
  //   const entry = {
  //     title: ``,
  //     color: ``,
  //     tags: new Set(),
  //     dueDate: 0,
  //     repeatingDays: {
  //       'mo': false,
  //       'tu': false,
  //       'we': false,
  //       'th': false,
  //       'fr': false,
  //       'sa': false,
  //       'su': false,
  //     }
  //   };
  //   const taskEditMapper = TaskEdit.createMapper(entry);
  //
  //   for (const pair of formData.entries()) {
  //     const [property, value] = pair;
  //     if (taskEditMapper[property]) {
  //       taskEditMapper[property](value);
  //     }
  //   }
  //
  //   return entry;
  // }

  _processForm(formData) {
    const entry = {
      type: {},
      title: ``,
      route: [],
      photos: [],
    }
    // this._type = data.type;
    // this._title = data.title;
    // this._tripRoute = data.tripRoute;
    // this._photos = data.photos;
    // this._offers = data.offers;
    // this._destination = data.destination;
    // this._price = data.price;
    // this._isFavorite = data.isFavorite;
    // this._dateBegin = data.dateBegin;
    // this._dateEnd = data.dateEnd;

  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    const formData = new FormData(this._formElement);
    console.log(...formData.entries());
    //const newData = this._processForm(formData);

    return typeof this._onSubmit === `function` && this._onSubmit();
  }

  // _onSubmitButtonClick(evt) {
  //   evt.preventDefault();
  //   const formData = new FormData(this._formElement);
  //   const newData = this._processForm(formData);
  //   newData.isDate = this._state.isDate;
  //   if (!moment(newData.dueDate).isValid() || newData.dueDate === 0) {
  //     newData.dueDate = Date.now();
  //   }
  //
  //   if (typeof this._onSubmit === `function`) {
  //     this._onSubmit(newData);
  //   }
  //   this.update(newData);
  // }


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

  set index(num) {
    this._index = num;
  }


  bind() {
    this._formElement = this._element.querySelector(`form`);
    this._formElement.addEventListener(`submit`, this._onFormSubmitBound);
    this._formElement.addEventListener(`reset`, this._onFormResetBound);
    this._formElement.addEventListener(`change`, this._onFormChangeBound);

    this._travelWayToggleElement = this._formElement.querySelector(`#travel-way__toggle-${this._index}`);
  }

  unbind() {
    this._formElement.removeEventListener(`submit`, this._onFormSubmitBound);
    this._formElement.removeEventListener(`reset`, this._onFormResetBound);
    this._formElement.removeEventListener(`change`, this._onFormChangeBound);
    this._formElement = null;
  }
}
