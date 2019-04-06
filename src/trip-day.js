import Component from './component';
import moment from 'moment';

export default class TripDay extends Component {
  constructor(data) {
    super();
    this._number = data.number;
    this._date = data.date;
  }

  _getFormattedDate() {
    return moment(this._date).format(`MMM DD`);
  }

  get template() {
    return `<section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">${this._number}</p>
        <h2 class="trip-day__title">${this._getFormattedDate()}</h2>
      </article>

      <div class="trip-day__items">

      </div>
    </section>`;
  }

  get number() {
    return this._number;
  }

  get itemsElement() {
    return this._element.querySelector(`.trip-day__items`);
  }
}
