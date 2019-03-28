import {getRandomInteger} from "./utils";
import getPoint from './get-trip-point';
import {MILLISECONDS_IN_DAY, HOURS, MINUTES} from "./const";
import Header from "./header";
import Filter from './filter';
import renderTrip, {getTotal} from './render-trip';
import renderStatistic from './render-statistic';


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
  const start = Date.now() - MILLISECONDS_IN_DAY * 3;
  let res = Array.from({length: count}, getPoint);

  // Добавляем в объект два свойства dateBegin, dateEnd

  res.forEach((element, index, arr) => {
    element.dateBegin = (index === 0) ? start : arr[index - 1].dateEnd;
    element.dateEnd = element.dateBegin + getRandomInteger(MINUTES / 12, HOURS * MINUTES) * MILLISECONDS_IN_DAY / HOURS / MINUTES; // от 5 мин. до 1 суток
  });
  return res;
};

// Функция возвращает объкт, содержащий данные о всей поездке вцелом

const getTrip = (count = 50) => {
  const events = getEventsArray(count);
  const route = events.map((element) => element.title);
  const title = route.join(` - `).substring(0, 140);
  events.forEach((element) => {
    element.tripRoute = route;
  });
  return {
    title,
    route,
    events,
    dateBegin: events[0].dateBegin,
    dateEnd: events[events.length - 1].dateEnd,
    total: getTotal(events),
  };
};

const renderHeader = (tripData, headerContainer) => {
  const header = new Header(tripData);
  const nextSiblingElement = headerContainer.querySelector(`section.trip-controls`);
  headerContainer.insertBefore(header.render(), nextSiblingElement);
  return header;
};

const tripHeaderContainer = document.querySelector(`.header__wrap`);
const tripDayContainer = document.querySelector(`.trip-day__items`);
const mainContainer = document.querySelector(`main`);
const statisticContainer = document.querySelector(`.statistic`);
const initialTrip = getTrip();

const header = renderHeader(initialTrip, tripHeaderContainer);
renderTrip(initialTrip, header, tripDayContainer);
renderStatistic(initialTrip, header, statisticContainer);

const tableButtonElement = document.querySelector(`nav.trip-controls__menus a:first-child`);
const statsButtonElement = document.querySelector(`nav.trip-controls__menus a:nth-child(2)`);

const onStatisticClick = () => {
  mainContainer.classList.add(`visually-hidden`);
  tableButtonElement.classList.remove(`view-switch__item--active`);

  statisticContainer.classList.remove(`visually-hidden`);
  statsButtonElement.classList.add(`view-switch__item--active`);
};

const onTableClick = () => {
  statisticContainer.classList.add(`visually-hidden`);
  statsButtonElement.classList.remove(`view-switch__item--active`);

  mainContainer.classList.remove(`visually-hidden`);
  tableButtonElement.classList.add(`view-switch__item--active`);
};

statsButtonElement.addEventListener(`click`, onStatisticClick);
tableButtonElement.addEventListener(`click`, onTableClick);

