import {ADDITIONAL_POINTS, POINT_TYPES, SHAKE_TIME} from './const';
import Component from './component';
import moment from 'moment';
import flatpickr from 'flatpickr';
import {createComponentElement, shake} from './utils';

const ERROR_STYLE = `border: 1px solid red;`;

export default class EventEdit extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._title = data.title;
    this._destinations = data.destinations;
    this._photos = data.photos;
    this._offers = data.offers.slice(0);
    this._destination = data.destination;
    this._price = data.price;
    this._isFavorite = data.isFavorite;
    this._dateBegin = data.dateBegin;
    this._dateEnd = data.dateEnd;

    this._index = null;

    this._formElement = null;
    this._travelWayToggleElement = null;
    this._dateBeginElement = null;
    this._dateBeginFlatpickr = null;
    this._dateEndElement = null;
    this._dateEndFlatpickr = null;
    this._destinationElement = null;

    this._onSubmit = null;
    this._onReset = null;
    this._onDelete = null;
    this._onEsc = null;
    this._onFormSubmitBound = this._onFormSubmit.bind(this);
    this._onFormResetBound = this._onFormReset.bind(this);
    this._onFormChangeBound = this._onFormChange.bind(this);
    this._onDeleteButtonClickBound = this._onDeleteButtonClick.bind(this);
    this._onChangeDestinationBound = this._onDestinationChange.bind(this);
    this._onEscKeyupBound = this._onEscKeyup.bind(this);
    this._onPriceInputBound = this._getOnlyDigits.bind(this);
  }

  _getFormattedDate(ms) {
    return moment(ms).format(`MMMM DD`);
  }

  _getFormattedTime(ms) {
    return moment(ms).format(`HH:MM`);
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
    return Array.from(new Set(this._destinations.map((it) => it.name))).concat(ADDITIONAL_POINTS).map((element) => `<option value="${element}"></option>`).join(``);
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
        <input class="point__input" type="text" placeholder="${this._getFormattedDate(this._dateBegin)}" name="day" value="${this._getFormattedDate(this._dateBegin)}">
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
      <div class="point__time">
        choose time
        <input class="point__input" type="text" value="${this._getFormattedTime(this._dateBegin)}" name="date-start" placeholder="${(moment(this._dateBegin).isValid()) ? this._getFormattedTime(this._dateBegin) : this._getFormattedTime(Date.now())} —">
        <input class="point__input" type="text" value="${this._getFormattedTime(this._dateEnd)}" name="date-end" placeholder="${(moment(this._dateEnd).isValid()) ? this._getFormattedTime(this._dateEnd) : this._getFormattedTime(Date.now())}">
      </div>

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
</article>`;
  }

  _onDestinationChange(evt) {
    const destination = this._destinations.find((it) => it.name === evt.target.value);
    if (typeof destination !== `undefined`) {
      this._title = destination.name;
      this._destination = destination.description;
      this._photos = destination.pictures.map((it) => it.src);
      this._partialUpdate();
    } else {
      evt.target.value = this._title;
    }
  }

  _onFormChange(evt) {
    if (evt.target.name === `travel-way`) {
      this._type = POINT_TYPES.find((element) => element.name === evt.target.value);
      this._formElement.querySelector(`.point__destination-label`).innerText = this._type.text;
      this._formElement.querySelector(`.travel-way__label`).innerText = this._type.icon;
      this._travelWayToggleElement.click();
      if (typeof this._type.offers !== `undefined`) {
        this._offers = this._type.offers.map((it) => {
          it.checked = false;
          return it;
        });
      } else {
        this._offers = [];
      }
      this._partialUpdate();
    }
  }

  _processForm(formData) {
    const dataEntry = {
      title: ``,
      offers: this._offers.map((element) => {
        const newObj = Object.assign({}, element);
        newObj.checked = false;
        return newObj;
      }),
      price: 0,
      isFavorite: false,
      dateBegin: 0,
      dateEnd: 0
    };

    const eventEditMapper = this._createMapper(dataEntry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (eventEditMapper[property]) {
        eventEditMapper[property](value);
      }
    }
    return dataEntry;
  }

  _markAsError(elementForStyle, elementForFocus = elementForStyle) {
    elementForStyle.style = ERROR_STYLE;
    elementForFocus.focus();
    return false;
  }

  _isValidForm() {
    if (this._destinations.findIndex((it) => it.name === this._destinationElement.value) < 0) {
      return this._markAsError(this._destinationElement);
    }
    if (typeof this._dateBegin === `undefined` || !moment(this._dateBegin).isValid()) {
      return this._markAsError(this._dateBeginFlatpickr.altInput, this._dateBeginElement);
    }
    if (typeof this._dateEnd === `undefined` || !moment(this._dateEnd).isValid()) {
      return this._markAsError(this._dateEndFlatpickr.altInput, this._dateEndElement);
    }
    if (isNaN(this._priceInputElement.value) || Number(this._priceInputElement.value) < 0) {
      return this._markAsError(this._priceInputElement);
    }
    return true;
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    if (!this._isValidForm()) {
      shake(this._element, SHAKE_TIME);
      return false;
    }

    const formData = new FormData(this._formElement);
    const newData = this._processForm(formData);

    [newData.dateBegin, newData.dateEnd] =
      [newData.dateBegin, newData.dateEnd]
      .map((element) => (!moment(element).isValid() || element === 0 || typeof element === `undefined`) ? Date.now() : element);

    if (typeof newData.type === `undefined`) {
      newData.type = this._type;
    }

    this.update(newData);
    return typeof this._onSubmit === `function` && this._onSubmit(newData);
  }

  _onFormReset(evt) {
    evt.preventDefault();
    return typeof this._onReset === `function` && this._onReset();
  }

  _onEscKeyup(evt) {
    return (typeof this._onEsc === `function`) && (evt.keyCode === 27) && this._onEsc();
  }

  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete(this._id);
    }
  }

  _getOnlyDigits(evt) {
    evt.target.value = evt.target.value.replace(/\D+/g, ``);
  }

  set onEsc(fn) {
    this._onEsc = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onReset(fn) {
    this._onReset = fn;
  }

  bind() {
    this._formElement = this._element.querySelector(`form`);
    this._formElement.addEventListener(`submit`, this._onFormSubmitBound);
    this._formElement.addEventListener(`reset`, this._onFormResetBound);
    this._formElement.addEventListener(`change`, this._onFormChangeBound);

    this._travelWayToggleElement = this._formElement.querySelector(`#travel-way__toggle-${this._index}`);
    this._destinationElement = this._formElement.querySelector(`#destination`);
    this._destinationElement.addEventListener(`change`, this._onChangeDestinationBound);

    this._dateBeginElement = this._formElement.querySelector(`.point__time input[name="date-start"]`);
    this._dateBeginFlatpickr = flatpickr(this._dateBeginElement,
        {
          mode: `single`,
          enableTime: true,
          dateFormat: `d m Y H:i`,
          altFormat: `H:i —`,
          altInput: true,
          defaultDate: this._dateBegin,
          maxDate: this._dateEnd,
          minDate: Date.now() - moment.duration(3, `years`),
          onClose: (dates) => {
            this._dateBegin = +moment(dates[0]);
            this._dateEndFlatpickr.config.minDate = this._dateBegin;
            this._dateBeginFlatpickr.altInput.style = ``;
          }
        });

    this._dateEndElement = this._formElement.querySelector(`.point__time input[name="date-end"]`);
    this._dateEndFlatpickr = flatpickr(this._dateEndElement,
        {
          mode: `single`,
          enableTime: true,
          dateFormat: `d m Y H:i`,
          altFormat: `H:i`,
          altInput: true,
          defaultDate: this._dateEnd,
          minDate: this._dateBegin,
          maxDate: Date.now() + moment.duration(3, `years`),
          onClose: (dates) => {
            this._dateEnd = +moment(dates[0]);
            this._dateBeginFlatpickr.config.maxDate = this._dateEnd;
            this._dateEndFlatpickr.altInput.style = ``;
          }
        });

    this._deleteButtonElement = this._formElement.querySelector(`.point__button[type="reset"]`);
    this._deleteButtonElement.addEventListener(`click`, this._onDeleteButtonClickBound);

    this._priceInputElement = this._formElement.querySelector(`input[name="price"]`);
    this._priceInputElement.addEventListener(`input`, this._onPriceInputBound);

    document.addEventListener(`keyup`, this._onEscKeyupBound);
  }

  unbind() {
    this._formElement.removeEventListener(`submit`, this._onFormSubmitBound);
    this._formElement.removeEventListener(`reset`, this._onFormResetBound);
    this._formElement.removeEventListener(`change`, this._onFormChangeBound);
    this._formElement = null;

    this._travelWayToggleElement = null;

    this._destinationElement.removeEventListener(`change`, this._onChangeDestinationBound);
    this._destinationElement = null;

    this._dateBeginFlatpickr.destroy();
    this._dateBeginFlatpickr = null;
    this._dateBeginElement = null;

    this._dateEndFlatpickr.destroy();
    this._dateEndFlatpickr = null;
    this._dateEndElement = null;

    this._deleteButtonElement.removeEventListener(`click`, this._onDeleteButtonClickBound);
    this._deleteButtonElement = null;

    this._priceInputElement.removeEventListener(`input`, this._onPriceInputBound);
    this._priceInputElement = null;
    document.removeEventListener(`keyup`, this._onEscKeyupBound);
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

  _partialUpdate() {
    this.unbind();
    this._element.innerHTML = createComponentElement(this.template).innerHTML;
    this.bind();
  }

  _createMapper(target) {
    return {
      'travel-way': (value) => {
        target.type = POINT_TYPES.find((element) => element.name === value);
      },
      'destination': (value) => {
        target.title = value;
      },
      'date-start': (value) => {
        target.dateBegin += +moment(value, `DD MM YYYY hh:mm a`);
      },
      'date-end': (value) => {
        target.dateEnd += +moment(value, `DD MM YYYY hh:mm a`);
      },
      'price': (value) => {
        target.price = +value;
      },
      'favorite': (value) => {
        target.isFavorite = value === `on`;
      },
      'offer': (value) => {
        target.offers.forEach((element) => {
          element.checked = element.checked || element.name.split(` `).join(`-`).toLowerCase() === value;
        });
      },
    };
  }
}
