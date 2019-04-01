import {POINT_TYPES} from './const';

export default class ModelEvent {
  constructor(data) {
    this.id = data[`id`];
    this.type = POINT_TYPES.find((element) => element.name === data[`type`]) || {};
    this.title = data[`destination`].name || ``;
    this.photos = new Set(data[`destination`].pictures.map((it) => it.src)) || [];
    this.offers = data[`offers`].map((it) => ({name: it.title, price: it.price, checked: it.accepted})) || [];
    this.destination = data[`destination`].description || ``;
    this.price = +data[`base_price`] || 0;
    this.isFavorite = data[`is_favorite`] || false;
    this.dateBegin = data[`date_from`] || 0;
    this.dateEnd = data[`date_to`] || 0;
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type.name,
      'destination': {
        name: this.title,
        description: this.destination,
        pictures: [...this.photos].map((it) => ({src: it}))
      },
      'offers': this.offers.map((it) => ({title: it.name, price: it.price, accepted: it.checked})),
      'base_price': this.price,
      'is_favorite': this.isFavorite,
      'date_from': this.dateBegin,
      'date_to': this.dateEnd
    };
  }

  static parseEvent(data) {
    return new ModelEvent(data);
  }

  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }
}
