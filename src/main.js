import {WAIT_TEXT, LOAD_ERROR_TEXT, POINT_TYPES, Sort} from './const';
import Header from './header';
import Filter from './filter';
import {renderTrip, getTotal} from './render-trip';
import renderStatistic from './render-statistic';
import API from './api';
import EventEdit from './event-edit';
import ModelNewEvent from './model-new-event';

const FILTERS_DATA = [
  {label: `Everything`, isChecked: true, filter: (events) => events.filter(() => true)},
  {label: `Future`, isChecked: false, filter: (events) => events.filter((it) => it.dateBegin > Date.now())},
  {label: `Past`, isChecked: false, filter: (events) => events.filter((it) => it.dateBegin < Date.now())},
];

const filtersContainer = document.querySelector(`.trip-filter`);

const getSortMethod = (collection) => [...collection].find((it) => it.checked).id;

FILTERS_DATA.forEach((element) => {
  const filter = new Filter(element);
  filter.onFilter = () => {
    filteredTrip.events = element.filter(initialTrip.events);
    renderTrip(filteredTrip, header, tripContainer, destinations, getSortMethod(sortButtonsElements));
    renderStatistic(filteredTrip, header, statisticContainer);
  };
  filtersContainer.appendChild(filter.render());
});

const copyTrip = (trip) => {
  const newObj = Object.assign({}, trip);
  newObj.events = trip.events.slice(0);
  return newObj;
};

// Функция возвращает объкт, содержащий данные о всей поездке вцелом

const getTrip = (events, destinations, offers) => {
  // Актуализируем справочник пипов событий. Каждому типу событий добавляем соответствующие доп.предложения
  POINT_TYPES.forEach((type) => {
    const findedOffers = offers.find((it) => type.name === it.type);
    if (typeof findedOffers !== `undefined`) {
      type.offers = findedOffers.offers;
    }
  });

  // Не знаем, в каком виде придут события от сервера, поэтому на всякий случай отсортируем.
  const newEvents = events.sort((a, b) => a.dateBegin - b.dateBegin);
  const route = newEvents.map((element) => element.title);
  const title = route.join(` - `);
  newEvents.forEach((element) => {
    element.tripRoute = route;
    element.destinations = destinations;

    // Необходимо актуализировать доп.предложния, дополнив невыбранные из справочника offers. при этом у них может быть разная цена.
    // Оставляем ту, что в этом событии.
    const tempArray = element.offers.map((it) => it);
    if (typeof element.type.offers === `undefined`) {
      element.offers = [];
    } else {
      element.offers = element.type.offers.map((offer) => {
        const newOffer = Object.assign({}, offer);
        const findedOffer = tempArray.find((it) => it.name === offer.name);
        if (typeof findedOffer !== `undefined`) {
          newOffer.price = findedOffer.price;
          newOffer.checked = findedOffer.checked;
        }
        return newOffer;
      });
    }
  });
  return {
    title,
    route,
    destinations,
    events: newEvents,
    dateBegin: newEvents[0].dateBegin,
    dateEnd: newEvents[newEvents.length - 1].dateEnd,
    total: getTotal(newEvents),
  };
};

const renderHeader = (tripData, headerContainer) => {
  const header = new Header(tripData);
  const nextSiblingElement = headerContainer.querySelector(`section.trip-controls`);
  headerContainer.insertBefore(header.render(), nextSiblingElement);
  return header;
};

const tripHeaderContainer = document.querySelector(`.header__wrap`);
const tripContainer = document.querySelector(`.trip-points`);
const mainContainer = document.querySelector(`main`);
const statisticContainer = document.querySelector(`.statistic`);
let initialTrip;
let filteredTrip;
let destinations;
let offers;
let header;

tripContainer.innerHTML = WAIT_TEXT;

const AUTHORIZATION = `Basic y3uu824638d0z048szh56sh`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;

export const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
Promise.all([api.getOffers(), api.getDestinations(), api.getEvents()])
  .then(([offersArray, destinationsArray, events]) => {
    offers = offersArray.map((it) => Object.assign({}, it));
    destinations = destinationsArray.map((it) => it);
    initialTrip = getTrip(events, destinations, offersArray);
    filteredTrip = copyTrip(initialTrip);
    header = renderHeader(filteredTrip, tripHeaderContainer);
    renderTrip(filteredTrip, header, tripContainer, destinations, Sort.EVENT);
    renderStatistic(filteredTrip, header, statisticContainer);
  })
  .catch(tripContainer.innerHTML = LOAD_ERROR_TEXT);

const tableButtonElement = document.querySelector(`nav.trip-controls__menus a:first-child`);
const statsButtonElement = document.querySelector(`nav.trip-controls__menus a:nth-child(2)`);
const sortFormElement = document.querySelector(`.trip-sorting`);
const sortButtonsElements = sortFormElement.querySelectorAll(`input[name="trip-sorting"]`);

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
  switch (evt.target.id) {
    case Sort.EVENT:
      renderTrip(filteredTrip, header, tripContainer, destinations, Sort.EVENT);
      break;
    case Sort.TIME:
      renderTrip(filteredTrip, header, tripContainer, destinations, Sort.TIME);
      break;
    case Sort.PRICE:
      renderTrip(filteredTrip, header, tripContainer, destinations, Sort.PRICE);
      break;
  }
};

statsButtonElement.addEventListener(`click`, onStatisticClick);
tableButtonElement.addEventListener(`click`, onTableClick);
sortFormElement.addEventListener(`change`, onSortFormChange);


const onNewEvenButtonClick = () => {
  newEventButtonElement.disabled = true;
  onTableClick();
  const data = {
    id: null,
    type: POINT_TYPES[0],
    title: ``,
    destinations,
    photos: [],
    offers: POINT_TYPES[0].offers.slice(0),
    destination: ``,
    price: 0,
    isFavorite: false,
    dateBegin: ``,
    dateEnd: ``,
  };

  const container = document.querySelector(`.trip-day__items`);
  const eventEdit = new EventEdit(data, container);
  container.insertBefore(eventEdit.render(), container.children[0]);

  eventEdit.onEsc = eventEdit.onDelete = () => {
    container.removeChild(eventEdit.element);
    eventEdit.unrender();
    newEventButtonElement.disabled = false;
  };

  eventEdit.onSubmit = (newObject) => {
    const newEvent = new ModelNewEvent(newObject);
    const destination = destinations.find((it) => it.name === newEvent.title);
    newEvent.destination = destination.description;
    newEvent.photos = destination.pictures;
    const sendObj = newEvent.toRAW();
    // При создании поинта возвращается только один id, поэтому вторым запросом отсылаю PUT-запрос на редактирование
    api.createEvent(sendObj, eventEdit.element)
      .then((idResolve) => api.updateEvent({id: idResolve.id, data: sendObj}, eventEdit.element))
      .then((newPoint) => {
        initialTrip.events.push(newPoint);
        initialTrip = getTrip(initialTrip.events, destinations, offers);
        filteredTrip = copyTrip(initialTrip);
        header.update(filteredTrip);
        renderTrip(filteredTrip, header, tripContainer, destinations, getSortMethod(sortButtonsElements));
        renderStatistic(filteredTrip, header, statisticContainer);
        newEventButtonElement.disabled = false;
      });
  };
};

const newEventButtonElement = tripHeaderContainer.querySelector(`.trip-controls__new-event`);
newEventButtonElement.addEventListener(`click`, onNewEvenButtonClick);
