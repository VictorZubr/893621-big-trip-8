import {MILLISECONDS_IN_MINUTE, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_DAY} from "./const";

const getDuration = (ms) => {
  const days = Math.floor(ms / MILLISECONDS_IN_DAY);
  const hours = Math.floor((ms - days * MILLISECONDS_IN_DAY) / MILLISECONDS_IN_HOUR);
  const minutes = Math.floor((ms - days * MILLISECONDS_IN_DAY - hours * MILLISECONDS_IN_HOUR) / MILLISECONDS_IN_MINUTE);
  return {days, hours, minutes};
};

const getFormattedDuration = (ms) => [[getDuration(ms).days, `d`], [getDuration(ms).hours, `h`], [getDuration(ms).minutes, `m`]]
  .map((element) => (element[0]) ? `${element[0]}${element[1]} ` : ``).join(``);

const getFormattedDate = (ms) => {
  const date = new Date(ms);
  return `${date.toLocaleString(`en-US`, {day: `2-digit`})} ${date.toLocaleString(`en-US`, {month: `long`})}`;
};

const getFormattedTime = (ms) => `${(new Date(ms)).toLocaleString(`en-US`, {hour12: false, hour: `2-digit`, minute: `2-digit`})}`;

const getFormattedTimetable = (begin, end) =>
  (getDuration(end - begin).days > 0) ?
    `${getFormattedDate(begin)} ${getFormattedTime(begin)}&nbsp;&mdash; ${getFormattedDate(end)} ${getFormattedTime(end)}` :
    `${getFormattedTime(begin)}&nbsp;&mdash; ${getFormattedTime(end)}`;

const getOffersHTML = (offers) =>
  offers
  .map((element) =>
    `<li><button class="trip-point__offer">${element.name} +&euro;&nbsp;${element.price}</button></li>`)
  .join(``);

export default (point) => `<article class="trip-point">
          <i class="trip-icon">${point.type.icon}</i>
          <h3 class="trip-point__title">${point.title}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${getFormattedTimetable(point.dateBegin, point.dateEnd)}</span>
            <span class="trip-point__duration">
                ${getFormattedDuration(point.dateEnd - point.dateBegin)}
            </span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${point.price}</p>
          <ul class="trip-point__offers">
            ${getOffersHTML(point.offers)}
          </ul>
        </article>`;
