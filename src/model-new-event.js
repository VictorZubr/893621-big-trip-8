import ModelEvent from './model-event';

export default class ModelNewEvent {
  constructor(data) {
    this.type = data.type;
    this.title = data.title;
    this.photos = data.photos;
    this.offers = data.offers;
    this.destination = data.destination;
    this.price = +data.price;
    this.isFavorite = data.isFavorite;
    this.dateBegin = data.dateBegin;
    this.dateEnd = data.dateEnd;
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type.name,
      'destination': {
        name: this.title,
        description: this.destination,
        pictures: [...this.photos],
      },
      'offers': this.offers.map((it) => ({title: it.name, price: it.price, accepted: it.checked})),
      'base_price': this.price,
      'is_favorite': this.isFavorite,
      'date_from': this.dateBegin,
      'date_to': this.dateEnd
    };
  }

  static parseNewEvent(data) {
    return new ModelEvent(data);
  }

  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }
}
