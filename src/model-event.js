import {POINT_TYPES} from './const';

export default class ModelEvent {
  constructor(data) {
    this.id = data[`id`];
    this.type = POINT_TYPES.find((element) => element.name === data[`type`]) || {};
    this.title = data[`destination`].name || ``;
    this.photos = new Set(data[`destination`].pictures.map((it) => it.src)) || [];
    this.offers = data[`offers`].map((it) => ({name: it.title, price: it.price, checked: it.accepted})) || [];
    this.destination = data[`destination`].description || ``;
    this.price = data[`base_price`] || 0;
    this.isFavorite = data[`is_favorite`] || false;
    this.dateBegin = data[`date_from`] || 0;
    this.dateEnd = data[`date_to`] || 0;
    //
    //   this.dueDate = new Date(data[`due_date`]);
    // this.tags = new Set(data[`tags`] || []);
    // this.picture = data[`picture`] || ``;
    // this.repeatingDays = data[`repeating_days`];
    // this.color = data[`color`];
    // this.isFavorite = Boolean(data[`is_favorite`]);
    // this.isDone = Boolean(data[`is_done`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'title': this.title,
      'due_date': this.dueDate,
      'tags': [...this.tags.values()],
      'picture': this.picture,
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_done': this.isDone,
    }
  }

  static parseEvent(data) {
    return new ModelEvent(data);
  }

  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }
};