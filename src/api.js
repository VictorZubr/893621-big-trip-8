import ModelEvent from'./model-event';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
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
      .then((resolve) => {
        console.log(resolve);
        return ModelEvent.parseEvents(resolve)
      });
  }


  createTask({task}) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  updateTask({id, data}) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTask.parseTask);
  }

  deleteTask({id}) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }
};