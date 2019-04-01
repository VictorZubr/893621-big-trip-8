import {WAIT_TEXT, LOAD_ERROR_TEXT} from './const';
import Header from './header';
import Filter from './filter';
import {renderTrip, getTotal} from './render-trip';
import renderStatistic from './render-statistic';
import API from './api';
import {POINT_TYPES} from './const';


const AUTHORIZATION = `Basic jkoiuy565656kB668500X42d29yZAo`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;

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

// Функция возвращает объкт, содержащий данные о всей поездке вцелом

const getTrip = (events, destinations, offers) => {
  POINT_TYPES.forEach((type) => {
    const findedOffers = offers.find((it) => type.name === it.type);
    if (typeof findedOffers !== `undefined`) {
      type.offers = findedOffers.offers;
    }
  });

  const route = events.map((element) => element.title);
  const title = route.join(` - `);
  events.forEach((element) => {
    element.tripRoute = route;
    element.destinations = destinations;
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
let initialTrip;
let header;
tripDayContainer.innerHTML = WAIT_TEXT;

export const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
Promise.all([api.getOffers(), api.getDestinations(), api.getEvents()])
  .then(([offers, destinations, events]) => {
    initialTrip = getTrip(events, destinations, offers);
    header = renderHeader(initialTrip, tripHeaderContainer);
    renderTrip(initialTrip, header, tripDayContainer, destinations);
  })
  .catch(() => {
    tripDayContainer.innerHTML = LOAD_ERROR_TEXT;
  });

const tableButtonElement = document.querySelector(`nav.trip-controls__menus a:first-child`);
const statsButtonElement = document.querySelector(`nav.trip-controls__menus a:nth-child(2)`);

const onStatisticClick = () => {
  renderStatistic(initialTrip, header, statisticContainer);
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

