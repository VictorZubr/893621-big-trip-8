import Event from './event';
import EventEdit from './event-edit';
import {api} from './main';
import TripDay from './trip-day';
import moment from 'moment';
import {sort} from './const';

export const getTotal = (events) =>
  events.reduce((total, element) => +total + element.price + element.offers.reduce((acc, it) => it.checked ? +acc + it.price : acc, 0), 0);

export const getPrice = (event) => +event.price + event.offers.reduce((acc, it) => it.checked ? acc + it.price : acc, 0);

const eventOnEdit = (event, eventEdit, eventsContainer) => {
  eventEdit.render();
  eventsContainer.replaceChild(eventEdit.element, event.element);
  event.unrender();
};

const updateTripData = (tripData, destinations) => {
  const route = tripData.events.map((it) => it.title);
  tripData.events.forEach((it) => {
    it.tripRoute = route;
    it.destinations = destinations;
  });
  tripData.title = route.join(` - `);
  tripData.route = route;
  tripData.total = getTotal(tripData.events);
  return tripData;
};

const eventEditOnSubmit = (tripData, header, element, event, eventEdit, dayContainer, eventsContainer, destinations, sortMethod, newObject) => {
  const oldPrice = getPrice(element);
  const newPrice = getPrice(newObject);
  const oldDateBegin = element.dateBegin;
  const newDateBegin = newObject.dateBegin;
  const isEventNameUpdated = element.title !== newObject.title;
  Object.assign(element, newObject);
  api.updateEvent({id: element.id, data: element.toRAW()}, eventEdit.element)
    .then((newEvent) => {
      event.update(newEvent);

      // Если дата начала события поменялась, то рендерим все события заново, чтобы событие встало в нужный контейнер
      if (+moment(oldDateBegin).startOf(`day`) !== +moment(newDateBegin).startOf(`day`)) {
        tripData = updateTripData(tripData, destinations);
        renderTrip(tripData, header, eventsContainer, destinations, sortMethod);
        header.update(tripData);
        return;
      }

      event.render();
      dayContainer.replaceChild(event.element, eventEdit.element);
      eventEdit.unrender();

      if (isEventNameUpdated) {
        const route = tripData.events.map((it) => it.title);
        const title = route.join(` - `);
        tripData.title = title;
        tripData.route = route;
      }
      if (oldPrice !== newPrice) {
        tripData.total = tripData.total - oldPrice + newPrice;
      }
      header.update(tripData);

    });
};

const eventEditOnReset = (event, eventEdit, eventsContainer) => {
  event.render();
  eventsContainer.replaceChild(event.element, eventEdit.element);
  eventEdit.unrender();
};

const eventEditOnDelete = (id, tripData, header, eventEdit, eventsContainer, destinations, sortMethod) => {
  api.deleteEvent({id}, eventEdit.element)
    .then(() => api.getEvents())
    .then((newEvents) => {
      tripData.events = newEvents;
      tripData = updateTripData(tripData, destinations);
      renderTrip(tripData, header, eventsContainer, destinations, sortMethod);
      header.update(tripData);
    });
};

const renderDay = (count, date, container) => {
  const tripDay = new TripDay({number: count, date});
  container.appendChild(tripDay.render());
  return tripDay;
};

export const renderTrip = (tripData, header, eventsContainer, destinations, sortMethod = sort.EVENT) => {
  eventsContainer.innerHTML = ``;
  let currentDate = null;
  let currentCount = 0;
  let pastDay = null;
  tripData.events
    .filter((it) => !it.isDeleted)
    .sort((a, b) => {
      switch (sortMethod) {
        case `sorting-event`:
          return a.dateBegin - b.dateBegin;
        case `sorting-time`:
          return (b.dateEnd - b.dateBegin) - (a.dateEnd - a.dateBegin);
        case `sorting-price`:
          return b.price - a.price;
      }
    })
    .forEach((element, index) => {
      // Если день другой, создаем новый контейнер дня
      const currentDay = (+moment(currentDate).startOf(`day`) !== +moment(element.dateBegin).startOf(`day`)) ?
        renderDay(++currentCount, element.dateBegin, eventsContainer) : pastDay;
      currentDate = element.dateBegin;
      pastDay = currentDay;

      const event = new Event(element, currentDay.element);
      const eventEdit = new EventEdit(element, currentDay.element);
      event.index = eventEdit.index = index;

      event.onEdit = () => {
        eventOnEdit(event, eventEdit, currentDay.itemsElement);
      };

      eventEdit.onSubmit = (newObject) => {
        eventEditOnSubmit(tripData, header, element, event, eventEdit, currentDay.itemsElement, eventsContainer, destinations, sortMethod, newObject);
      };

      eventEdit.onReset = () => {
        eventEditOnReset(event, eventEdit, currentDay.itemsElement);
      };

      eventEdit.onEsc = () => {
        eventEditOnReset(event, eventEdit, currentDay.itemsElement);
      };

      eventEdit.onDelete = (id) => {
        eventEditOnDelete(id, tripData, header, eventEdit, eventsContainer, destinations, sortMethod);
      };

      currentDay.itemsElement.appendChild(event.render());
    });
};
