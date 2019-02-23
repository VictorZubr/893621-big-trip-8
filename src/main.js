import getFilterTemplate from './make-filter';
import getTripPointTemplate from './make-trip-point';

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

const getTripDayContent = (count = 7) => {
  let result = ``;
  while (count--) {
    result += getTripPointTemplate();
  }
  return result;
};

const tripDaydElement = document.querySelector(`.trip-day__items`);
tripDaydElement.insertAdjacentHTML(`beforeend`, getTripDayContent());

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

const filterElements = filtersContainer.querySelectorAll(`input`);

filterElements.forEach((element) => element.addEventListener(`click`, () => {
  tripDaydElement.innerHTML = ``;
  tripDaydElement.insertAdjacentHTML(`beforeend`, getTripDayContent(getRandomInteger(1, 20)));
}));
