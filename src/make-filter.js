export default (filter) =>
  `<input type="radio" id="${filter.id}" name="filter" value="${filter.label.toLowerCase()}" ${filter.status}>
  <label class="trip-filter__item" for="${filter.id}">${filter.label}</label>`;
