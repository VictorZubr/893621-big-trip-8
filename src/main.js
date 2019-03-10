import {getRandomInteger} from "./utils";
import getFilterTemplate from './make-filter';
import getTripHeaderHTML from './make-trip-header';
import getPoint from './get-trip-point';
import {MILLISECONDS_IN_DAY, HOURS, MINUTES} from "./const";
import Event from './event';
import EventEdit from './event-edit';

const filters = [
  {
    label: `Everything`,
    id: `filter-everything`,
    status: `checked`,
  },
  {
    label: `Future`,
    id: `filter-future`,
    status: ``,
  },
  {
    label: `Past`,
    id: `filter-past`,
    status: ``,
  },
];

const getTripFilterHTML = (arr) => arr.reduce((str, item) => str + getFilterTemplate(item), ``);

const filtersContainer = document.querySelector(`.trip-filter`);
filtersContainer.insertAdjacentHTML(`beforeend`, getTripFilterHTML(filters));

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
    total: events.reduce((total, element) => total + element.price, 0),
  };
};

const renderEvents = (events, container) => events.map((element) => {
  const event = new Event(element);

  const eventEdit = new EventEdit(element);
  event.onEdit = () => {
    eventEdit.render();
    container.replaceChild(eventEdit.element, event.element);
    event.unrender();
  };
  eventEdit.onSubmit = () => {
    event.render();
    container.replaceChild(event.element, eventEdit.element);
    eventEdit.unrender();
  };
  eventEdit.onReset = () => {
    event.render();
    container.replaceChild(event.element, eventEdit.element);
    eventEdit.unrender();
  };

  container.appendChild(event.render());
  return event;
});

const unrenderEvents = (events, container) => events.forEach((item) => {
  if (item.element) {
    container.removeChild(item.element);
    item.unrender();
  }
});

const renderTrip = (trip, headerContainer, eventsContainer) => {
  headerContainer.insertAdjacentHTML(`afterBegin`, getTripHeaderHTML(trip));
  return renderEvents(trip.events, eventsContainer);
};

const unrenderTrip = (headerContainer, eventsContainer) => {
  const deletedElement = headerContainer.querySelector(`:first-child`);
  headerContainer.removeChild(deletedElement);
  unrenderEvents(events, eventsContainer);
};

const tripHeaderContainer = document.querySelector(`.header__wrap`);
const tripDayContainer = document.querySelector(`.trip-day__items`);

let events = renderTrip(getTrip(), tripHeaderContainer, tripDayContainer);

const filterElements = filtersContainer.querySelectorAll(`input`);

filterElements.forEach((element) => element.addEventListener(`click`, () => {
  unrenderTrip(tripHeaderContainer, tripDayContainer);
  events = renderTrip(getTrip(getRandomInteger(1, 20)), tripHeaderContainer, tripDayContainer);
}));
