import {getRandomInteger} from "./utils";
import getFilterTemplate from './make-filter';
import getTripPointTemplate from './make-trip-point';
import getTrip from './get-trip-point';
import {MILLISECONDS_IN_DAY, WEEK} from "./const";

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

const getPointsArray = (count = 7) => {
  const start = Date.now();
  const res = Array.from({length: count}, getTrip);

  // Добавляем в объект два свойства dateBegin, dateEnd

  res.forEach((element, index, arr) => {
    element.dateBegin = (index === 0) ? start : arr[index - 1].dateEnd;
    element.dateEnd = element.dateBegin + getRandomInteger(0, WEEK * 24) * MILLISECONDS_IN_DAY / 24;
  });
  return res;
};

// Функция возвращает единый шаблон всех точек маршрута из массива

const getTripDayContent = (points) => points.map((element) => getTripPointTemplate(element)).join(``);

const tripDaydElement = document.querySelector(`.trip-day__items`);
tripDaydElement.insertAdjacentHTML(`beforeend`, getTripDayContent(getPointsArray()));

const filterElements = filtersContainer.querySelectorAll(`input`);

filterElements.forEach((element) => element.addEventListener(`click`, () => {
  tripDaydElement.innerHTML = ``;
  tripDaydElement.insertAdjacentHTML(`beforeend`, getTripDayContent(getPointsArray(getRandomInteger(1, 20))));
}));
