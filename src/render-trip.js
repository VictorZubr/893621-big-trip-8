import Event from './event';
import EventEdit from './event-edit';
import {api} from './main';
import TripDay from './trip-day';
import moment from 'moment';
import {Sort} from './const';

export const getTotal = (events) =>
  events.reduce((total, element) => +total + element.price + element.offers.reduce((acc, it) => it.checked ? +acc + it.price : acc, 0), 0);

export const getPrice = (event) => +event.price + event.offers.reduce((acc, it) => it.checked ? acc + it.price : acc, 0);

const eventOnEdit = (event, eventEdit, eventsContainer) => {
  eventEdit.render();
  eventsContainer.replaceChild(eventEdit.element, event.element);
  event.unrender();
};

const updateTripData = (tripData, destinations) => {
  tripData.events = tripData.events.sort((a, b) => a.dateBegin - b.dateBegin);
  const route = tripData.events.map((it) => it.title);
  tripData.events.forEach((it) => {
    it.tripRoute = route;
    it.destinations = destinations;
  });
  tripData.title = route.join(` - `);
  tripData.route = route;
  tripData.total = getTotal(tripData.events);
  tripData.dateBegin = tripData.events[0].dateBegin;
  tripData.dateEnd = tripData.events[tripData.events.length - 1].dateEnd;
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

const eventEditOnReset = (element, event, eventEdit, eventsContainer) => {
  event.render();
  eventsContainer.replaceChild(event.element, eventEdit.element);
  eventEdit.update(element);
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

export const renderTrip = (tripData, header, eventsContainer, destinations, sortMethod = Sort.EVENT) => {
  eventsContainer.innerHTML = ``;
  let currentDate = null;
  let currentCount = 0;
  let pastDay = null;
  tripData.events
    .filter((it) => !it.isDeleted)
    .sort((a, b) => {
      switch (sortMethod) {
        case Sort.TIME:
          return (b.dateEnd - b.dateBegin) - (a.dateEnd - a.dateBegin);
        case Sort.PRICE:
          return b.price - a.price;
      }
      return a.dateBegin - b.dateBegin;
    })
    .forEach((element, index) => {
      // Если день другой, создаем новый контейнер дня
      const currentDay = (+moment(currentDate).startOf(`day`) !== +moment(element.dateBegin).startOf(`day`)) ?
        renderDay(++currentCount, element.dateBegin, eventsContainer) : pastDay;
      currentDate = element.dateBegin;
      pastDay = currentDay;

      const event = new Event(element);
      const eventEdit = new EventEdit(element);
      eventEdit.index = index;

      event.onEdit = () => {
        eventOnEdit(event, eventEdit, currentDay.itemsElement);
      };

      eventEdit.onSubmit = (newObject) => {
        eventEditOnSubmit(tripData, header, element, event, eventEdit, currentDay.itemsElement, eventsContainer, destinations, sortMethod, newObject);
      };

      eventEdit.onReset = () => {
        eventEditOnReset(element, event, eventEdit, currentDay.itemsElement);
      };

      eventEdit.onEsc = () => {
        eventEditOnReset(element, event, eventEdit, currentDay.itemsElement);
      };

      eventEdit.onDelete = (id) => {
        eventEditOnDelete(id, tripData, header, eventEdit, eventsContainer, destinations, sortMethod);
      };

      currentDay.itemsElement.appendChild(event.render());
    });
};
