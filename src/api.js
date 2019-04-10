import ModelEvent from './model-event';
import ModelDestination from './model-destination';
import ModelOffers from './model-offers';
import {shake} from './utils';
import {SHAKE_TIME} from './const';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ButtonText = {
  SAVE: `Save`,
  SAVING: `Saving...`,
  DELETE: `Delete`,
  DELETING: `Deleting...`
};

const ResponseStatus = {
  OK: 200,
  REDIRECTION: 300
};

const checkStatus = (response) => {
  if (response.status >= ResponseStatus.OK && response.status < ResponseStatus.REDIRECTION) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(ModelEvent.parseEvents);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON)
      .then(ModelDestination.parseDestinations);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON)
      .then(ModelOffers.parseOffers);
  }

  static blockEventEdit(element) {
    element.style = ``;
    element.querySelector(`.point__destination-input`).disabled = true;
    element.querySelector(`.point__button--save`).disabled = true;
    element.querySelector(`[type='reset']`).disabled = true;
  }

  static unBlockEventEdit(element) {
    element.querySelector(`[type='reset']`).disabled = false;
    element.querySelector(`.point__button--save`).disabled = false;
    element.querySelector(`.point__destination-input`).disabled = false;
    element.style = `border: 3px solid red;`;
  }

  updateEvent({id: id, data}, element) {
    element.querySelector(`.point__button--save`).textContent = ButtonText.SAVING;
    API.blockEventEdit(element);
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelEvent.parseEvent)
      .catch((err) => {
        setTimeout(() => {
          shake(element, SHAKE_TIME);
          API.unBlockEventEdit(element);
          element.querySelector(`.point__button--save`).textContent = ButtonText.SAVE;
        }, SHAKE_TIME);
        throw err;
      });

  }

  deleteEvent({id}, element) {
    element.querySelector(`[type='reset']`).textContent = ButtonText.DELETING;
    API.blockEventEdit(element);
    return this._load({url: `points/${id}`, method: Method.DELETE})
      .catch((err) => {
        shake(element, SHAKE_TIME);
        API.unBlockEventEdit(element);
        element.querySelector(`[type='reset']`).textContent = ButtonText.DELETE;
        throw err;
      });
  }

  createEvent(event, element) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event),
      header: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .catch((err) => {
        setTimeout(() => {
          shake(element, SHAKE_TIME);
          API.unBlockEventEdit(element);
          element.querySelector(`.point__button--save`).textContent = ButtonText.SAVE;
        }, SHAKE_TIME);
        throw err;
      });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
