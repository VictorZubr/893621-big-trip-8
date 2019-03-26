import {getRandomInteger} from "./utils";
//import getFilterTemplate from './make-filter';
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
    filter: (events) => events
  },
  {
    label: `Future`,
    isChecked: false,
    filter: (events) => events.filter((it) => it.dateBegin > Date.now())
  },
  {
    label: `Past`,
    isChecked: false,
    filter: (events) => events.filter((it) => it.dateBegin < Date.now())
  },
];

const TERS_DATA = [
  {label: `ALL`, isChecked: true,
    filter: (tasks) => tasks},
  {label: `OVERDUE`, isChecked: false,
    filter: (tasks) => tasks.filter((it) => it.isDate && it.dueDate < Date.now())},
  {label: `TODAY`, isChecked: false,
    filter: (tasks) => tasks.filter((it) => it.isDate && +moment(it.dueDate).startOf(`day`) === +moment().startOf(`day`))},
  {label: `FAVORITES`, isChecked: false,
    filter: (tasks) => tasks.filter((it) => it.isFavorite)},
  {label: `Repeating`, isChecked: false,
    filter: (tasks) => tasks.filter((it) => Object.values(it.repeatingDays).some((element) => element))},
  {label: `Tags`, isChecked: false,
    filter: (tasks) => tasks.filter((it) => it.tags.size)},
  {label: `ARCHIVE`, isChecked: false,
    filter: (tasks) => tasks}
];

//const getTripFilterHTML = (arr) => arr.reduce((str, item) => str + getFilterTemplate(item), ``);
const filtersContainer = document.querySelector(`.trip-filter`);

FILTERS_DATA.forEach((element) => {
  const filter = new Filter(element);
  filter.onFilter = () => renderTrip(element.filter(trip.events), tripHeaderContainer, tripDayContainer);
  filtersContainer.appendChild(filter.render());
});

//filtersContainer.insertAdjacentHTML(`beforeend`, getTripFilterHTML(filters));

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

const getTripComponents = (tripData, container) => {
  const header = new TripHeader(tripData);
  const events = tripData.events
    .map((element, index) => {
      const event = new Event(element);
      const eventEdit = new EventEdit(element);
      event.index = index;
      eventEdit.index = index;

      event.onEdit = () => {
        eventEdit.render();
        container.replaceChild(eventEdit.element, event.element);
        event.unrender();
      };

      eventEdit.onSubmit = (newObject) => {
        Object.assign(element, newObject);
        event.update(element);
        event.render();
        container.replaceChild(event.element, eventEdit.element);
        eventEdit.unrender();
      };

      eventEdit.onReset = () => {
        event.render();
        container.replaceChild(event.element, eventEdit.element);
        eventEdit.unrender();
      };
      eventEdit.onDelete = () => {
        container.removeChild(eventEdit.element);
        element.isDeleted = true;
        eventEdit.unrender();
        console.log(tripData);
      };
      return [event, eventEdit];
    });
  return {header, events};
};

const renderEvents = (events, container) => events.forEach(([it]) => container.appendChild(it.render()));

const unrenderEvents = (events, container) => events.forEach(([event, eventEdit]) => {
  if (event.element) {
    container.removeChild(event.element);
    event.unrender();
  }
  if (eventEdit.element) {
    container.removeChild(eventEdit.element);
    eventEdit.unrender();
  }
});



const renderTrip = (trip, headerContainer, eventsContainer) => {
  const nextSiblingElement = headerContainer.querySelector(`section.trip-controls`);
  headerContainer.insertBefore(trip.header.render(), nextSiblingElement);
  renderEvents(trip.events, eventsContainer);
  //trip.events.forEach(([event]) => eventsContainer.appendChild(event.render()));
};

const unrenderTrip = (trip, headerContainer, eventsContainer) => {
  if (trip.header.element) {
    headerContainer.removeChild(trip.header.element);
    trip.header.unrender();
  }
  unrenderEvents(trip.events, eventsContainer);
};

const tripHeaderContainer = document.querySelector(`.header__wrap`);
const tripDayContainer = document.querySelector(`.trip-day__items`);
const initialTrip = getTrip();

const tripComponenets = getTripComponents(initialTrip, tripDayContainer);
renderTrip(tripComponenets, tripHeaderContainer, tripDayContainer);

// const filterElements = filtersContainer.querySelectorAll(`input`);
//
// filterElements.forEach((element) => element.addEventListener(`click`, () => {
//   unrenderTrip(trip, tripHeaderContainer, tripDayContainer);
//   trip = getTripComponents(getTrip(getRandomInteger(1, 20)), tripDayContainer);
//   renderTrip(trip, tripHeaderContainer, tripDayContainer);
// }));
