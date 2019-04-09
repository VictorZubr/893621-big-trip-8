export const MILLISECONDS_IN_MINUTE = 60 * 1000;
export const MILLISECONDS_IN_HOUR = 60 * MILLISECONDS_IN_MINUTE;
export const ADDITIONAL_POINTS = [`airport`, `hotel`];
export const WAIT_TEXT = `<section class="trip-day" style="padding-left: 150px; font-weight: bold">Loading route...</section>`;
export const LOAD_ERROR_TEXT = `<section class="trip-day" style="padding-left: 150px; font-weight: bold">Something went wrong while loading your route info. Check your connection or try again later.</section>`;
export const SHAKE_TIME = 1000;

export const POINT_TYPES = [
  {name: `taxi`, icon: `🚕`, text: `Taxi to`, group: 1},
  {name: `bus`, icon: `🚌`, text: `Bus to`, group: 1},
  {name: `train`, icon: `🚂`, text: `Train to`, group: 1},
  {name: `ship`, icon: `🛳️`, text: `Ship to`, group: 1},
  {name: `transport`, icon: `🚊`, text: `Transport to`, group: 1},
  {name: `drive`, icon: `🚗`, text: `Drive to`, group: 1},
  {name: `flight`, icon: `✈️`, text: `Flight to`, group: 1},
  {name: `check-in`, icon: `🏨`, text: `Check-in`, group: 2},
  {name: `sightseeing`, icon: `🏛️`, text: `Sightseeing`, group: 2},
  {name: `restaurant`, icon: `🍴`, text: `Restaurant`, group: 2}
];

export const Sort = {
  EVENT: `sorting-event`,
  TIME: `sorting-time`,
  PRICE: `sorting-price`
};
