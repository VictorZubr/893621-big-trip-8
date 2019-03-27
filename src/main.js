import {getRandomInteger} from "./utils";
import getPoint from './get-trip-point';
import {MILLISECONDS_IN_DAY, HOURS, MINUTES} from "./const";
import Event from './event';
import EventEdit from './event-edit';
import TripHeader from "./trip-header";
import Filter from './filter';

const FILTERS_DATA = [
  {
    label: `Everything`,
    isChecked: true,
    filter: (trip) => {
      const newObj = {};
      Object.assign(newObj, trip);
      return newObj;
    }
  },
  {
    label: `Future`,
    isChecked: false,
    filter: (trip) => {
      const newObj = {};
      Object.assign(newObj, trip);
      newObj.events = trip.events.filter((it) => it.dateBegin > Date.now());
      return newObj;
    }
  },
  {
    label: `Past`,
    isChecked: false,
    filter: (trip) => {
      const newObj = {};
      Object.assign(newObj, trip);
      newObj.events = trip.events.filter((it) => it.dateBegin < Date.now());
      return newObj;
    }
  },
];

const filtersContainer = document.querySelector(`.trip-filter`);

FILTERS_DATA.forEach((element) => {
  const filter = new Filter(element);
  filter.onFilter = () => renderTrip(element.filter(initialTrip), header, tripDayContainer);
  filtersContainer.appendChild(filter.render());
});

// Функция возвращает массив с требуемым количеством точек маршрута. Дата окончания первой точки становится датой начала второй точки.

const getEventsArray = (count = 7) => {
  const start = Date.now();
  let res = Array.from({length: count}, getPoint);

  // Добавляем в объект два свойства dateBegin, dateEnd

  res.forEach((element, index, arr) => {
    element.dateBegin = (index === 0) ? start : arr[index - 1].dateEnd;
    element.dateEnd = element.dateBegin + getRandomInteger(MINUTES / 12, HOURS * MINUTES) * MILLISECONDS_IN_DAY / HOURS / MINUTES; // от 5 мин. до 1 суток
  });
  return res;
};

const getTotal = (events) =>
  events.reduce((total, element) => total + element.price + element.offers.reduce((acc, it) => it.checked ? acc + it.price : acc, 0), 0);

// Функция возвращает объкт, содержащий данные о всей поездке вцелом

const getTrip = (count = 7) => {
  const events = getEventsArray(count);
  const route = events.map((element) => element.title);
  events.forEach((element) => {
    element.tripRoute = route;
  });
  return {
    route,
    events,
    dateBegin: events[0].dateBegin,
    dateEnd: events[events.length - 1].dateEnd,
    total: getTotal(events),
  };
};

const renderHeader = (tripData, headerContainer) => {
  const header = new TripHeader(tripData);
  const nextSiblingElement = headerContainer.querySelector(`section.trip-controls`);
  headerContainer.insertBefore(header.render(), nextSiblingElement);
  return header;
};

const getPrice = (event) => +event.price + event.offers.reduce((acc, it) => it.checked ? acc + it.price : acc, 0);

const renderTrip = (tripData, header, eventsContainer) => {
  eventsContainer.innerHTML = ``;
  tripData.events
    .filter((it) => !it.isDeleted)
    .forEach((element, index) => {
      const event = new Event(element);
      const eventEdit = new EventEdit(element);
      event.index = index;
      eventEdit.index = index;

      event.onEdit = () => {
        eventEdit.render();
        eventsContainer.replaceChild(eventEdit.element, event.element);
        event.unrender();
      };

      eventEdit.onSubmit = (newObject) => {
        const oldPrice = getPrice(element);
        const newPrice = getPrice(newObject);
        Object.assign(element, newObject);
        event.update(element);
        event.render();
        eventsContainer.replaceChild(event.element, eventEdit.element);
        eventEdit.unrender();
        if (oldPrice !== newPrice) {

          tripData.total = tripData.total - oldPrice + newPrice;
          header.update(tripData);
        }

      };

      eventEdit.onReset = () => {
        event.render();
        eventsContainer.replaceChild(event.element, eventEdit.element);
        eventEdit.unrender();
      };
      eventEdit.onDelete = () => {
        eventsContainer.removeChild(eventEdit.element);
        element.isDeleted = true;
        eventEdit.unrender();
      };
      eventsContainer.appendChild(event.render());
    });
};


const tripHeaderContainer = document.querySelector(`.header__wrap`);
const tripDayContainer = document.querySelector(`.trip-day__items`);
const initialTrip = getTrip();

const header = renderHeader(initialTrip, tripHeaderContainer);
renderTrip(initialTrip, header, tripDayContainer);

