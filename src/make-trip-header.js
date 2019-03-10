const getFormattedDate = (ms) => {
  const date = new Date(ms);
  return `${date.toLocaleString(`en-US`, {month: `long`})} ${date.toLocaleString(`en-US`, {day: `2-digit`})}`;
};

const getSecondFormattedDate = (begin, end) => {
  const date = new Date(end);
  return (new Date(begin).getMonth() === date.getMonth()) ? `${date.toLocaleString(`en-US`, {day: `2-digit`})}` : getFormattedDate(end);
};

export default (trip) => {
  return `<section class="trip">
            <div class="trip__schedule">
                <i class="trip-icon">⛰️</i>
                <h1 class="trip__points">${trip.events.map((element) => element.title).join(` - `)}</h1>
                <p class="trip__dates">${getFormattedDate(trip.dateBegin)}&nbsp;&mdash; ${getSecondFormattedDate(trip.dateBegin, trip.dateEnd)}</p>
            </div>
            <p class="trip__total">Total: <span class="trip__total-cost">&euro;&nbsp;${trip.total}</span></p>
        </section>`;
};
