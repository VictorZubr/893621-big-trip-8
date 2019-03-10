import {getRandomInteger, getRandomItems, getTrueOrFalse} from "./utils";
import {
  POINT_TYPES,
  OFFERS,
  DESCRIPTION_TEXT,
  TOWNS
} from "./const";

const descriptions = DESCRIPTION_TEXT.split(/\. */);

export default () => ({
  type: POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)],
  title: TOWNS[getRandomInteger(0, TOWNS.length - 1)],
  photos: new Set(Array.from({length: getRandomInteger(1, 5)}).map(() => `http://picsum.photos/300/150?r=${Math.random()}`)),
  offers: getRandomItems(OFFERS, getRandomInteger(0, 2)).map((element) => ({name: element, price: getRandomInteger(5, 100)})),
  destination: `${getRandomItems(descriptions, getRandomInteger(1, 3)).join(`. `)}.`,
  price: getRandomInteger(10, 1000),
  isFavorite: getTrueOrFalse(),
});
