import ModelEvent from './model-event';
import ModelDestination from './model-destination';
import ModelOffers from './model-offers';

const SHAKE_TIME = 1000;
const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const buttonText = {
  SAVE: `Save`,
  SAVING: `Saving...`,
  DELETE: `Delete`,
  DELETING: `Deleting...`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
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

  _blockEventEdit(element) {
    element.style = ``;
    element.querySelector(`.point__destination-input`).disabled = true;
    element.querySelector(`.point__button--save`).disabled = true;
    element.querySelector(`[type='reset']`).disabled = true;
  }

  _unBlockEventEdit(element) {
    element.querySelector(`[type='reset']`).disabled = false;
    element.querySelector(`.point__button--save`).disabled = false;
    element.querySelector(`.point__destination-input`).disabled = false;
    element.style = `border: 3px solid red;`;
  }

  _shake(element) {
    element.classList.add(`shake`);
    setTimeout(() => {
      element.classList.remove(`shake`);
    }, SHAKE_TIME);
  }

  updateEvent({id, data}, element) {
    element.querySelector(`.point__button--save`).textContent = buttonText.SAVING;
    this._blockEventEdit(element);
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
          this._shake(element);
          this._unBlockEventEdit(element);
          element.querySelector(`.point__button--save`).textContent = buttonText.SAVE;
        }, SHAKE_TIME);
        throw err;
      });

  }

  deleteEvent(id, element) {
    element.querySelector(`[type='reset']`).textContent = buttonText.DELETING;
    this._blockEventEdit(element);
    return this._load({url: `points/${id}`, method: Method.DELETE})
      .catch((err) => {
        this._shake(element);
        this._unBlockEventEdit(element);
        element.querySelector(`[type='reset']`).textContent = buttonText.DELETE;
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
