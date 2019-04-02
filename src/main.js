import {WAIT_TEXT, LOAD_ERROR_TEXT} from './const';
import Header from './header';
import Filter from './filter';
import {renderTrip, getTotal} from './render-trip';
import renderStatistic from './render-statistic';
import API from './api';
import {POINT_TYPES, sort} from './const';

const AUTHORIZATION = `Basic jkoiuy56565h6k546j502d29yZAo`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;

const FILTERS_DATA = [
  {
    label: `Everything`,
    isChecked: true,
    filter: (trip) => {
      const newObj = {};
      Object.assign(newObj, trip);
      newObj.events = trip.events.filter((it) => it).sort((a, b) => a.dateBegin - b.dateBegin);
      return newObj;
    }
  },
  {
    label: `Future`,
    isChecked: false,
    filter: (trip) => {
      const newObj = {};
      Object.assign(newObj, trip);
      newObj.events = trip.events.filter((it) => it.dateBegin > Date.now()).sort((a, b) => a.dateBegin - b.dateBegin);
      return newObj;
    }
  },
  {
    label: `Past`,
    isChecked: false,
    filter: (trip) => {
      const newObj = {};
      Object.assign(newObj, trip);
      newObj.events = trip.events.filter((it) => it.dateBegin < Date.now()).sort((a, b) => a.dateBegin - b.dateBegin);
      return newObj;
    }
  },
];

const filtersContainer = document.querySelector(`.trip-filter`);

FILTERS_DATA.forEach((element) => {
  const filter = new Filter(element);
  filter.onFilter = () => {
    filteredTrip = element.filter(initialTrip);
    renderTrip(filteredTrip, header, tripContainer, destinations, sort.TIME);
    renderStatistic(filteredTrip, header, statisticContainer);
    [...sortButtonsElements].forEach((it, index) => it.checked = !index);
  };
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
//const tripContainer = document.querySelector(`.trip-day__items`);
const tripContainer = document.querySelector(`.trip-points`);
const mainContainer = document.querySelector(`main`);
const statisticContainer = document.querySelector(`.statistic`);
let initialTrip;
let filteredTrip;
let destinations;
let header;

tripContainer.innerHTML = WAIT_TEXT;

export const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
Promise.all([api.getOffers(), api.getDestinations(), api.getEvents()])
  .then(([offers, destinationsArray, events]) => {
    destinations = destinationsArray;
    initialTrip = getTrip(events, destinations, offers);
    filteredTrip = initialTrip;
    console.log(initialTrip);
    header = renderHeader(filteredTrip, tripHeaderContainer);
    renderTrip(filteredTrip, header, tripContainer, destinations, sort.TIME);
    renderStatistic(filteredTrip, header, statisticContainer);

  })
  .catch((err) => {
    console.error(err);
    tripContainer.innerHTML = LOAD_ERROR_TEXT;
  });

const tableButtonElement = document.querySelector(`nav.trip-controls__menus a:first-child`);
const statsButtonElement = document.querySelector(`nav.trip-controls__menus a:nth-child(2)`);
const sortFormElement = document.querySelector(`.trip-sorting`);
const sortButtonsElements = sortFormElement.querySelectorAll(`input[name="trip-sorting"]`);
console.log(sortButtonsElements);

const onStatisticClick = () => {
  renderStatistic(filteredTrip, header, statisticContainer);
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

const onSortFormChange = (evt) => {
  switch (evt.target.id){
    case `sorting-event`:
      filteredTrip.events = filteredTrip.events.sort((a, b) => a.dateBegin - b.dateBegin);
      renderTrip(filteredTrip, header, tripContainer, destinations, sort.EVENT);
      break;
    case `sorting-time`:
      filteredTrip.events = filteredTrip.events.sort((a, b) => (a.dateEnd - a.dateBegin) - (b.dateEnd - b.dateBegin));
      renderTrip(filteredTrip, header, tripContainer, destinations, sort.TIME);
      break;
    case `sorting-price`:
      filteredTrip.events = filteredTrip.events.sort((a, b) => a.price - b.price);
      renderTrip(filteredTrip, header, tripContainer, destinations, sort.PRICE);
      break;
  }
};

statsButtonElement.addEventListener(`click`, onStatisticClick);
tableButtonElement.addEventListener(`click`, onTableClick);
sortFormElement.addEventListener(`change`, onSortFormChange);

