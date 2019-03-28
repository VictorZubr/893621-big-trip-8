import Event from './event';
import EventEdit from './event-edit';


export const getTotal = (events) =>
  events.reduce((total, element) => total + element.price + element.offers.reduce((acc, it) => it.checked ? acc + it.price : acc, 0), 0);

export const getPrice = (event) => +event.price + event.offers.reduce((acc, it) => it.checked ? acc + it.price : acc, 0);

export default (tripData, header, eventsContainer) => {
  eventsContainer.innerHTML = ``;
  tripData.events
    .filter((it) => !it.isDeleted)
    .forEach((element, index) => {
      const event = new Event(element);
      const eventEdit = new EventEdit(element);
      event.index = index;
      eventEdit.index = index;

      event.onEdit = () => {
        eventEdit.render();
        eventsContainer.replaceChild(eventEdit.element, event.element);
        event.unrender();
      };

      eventEdit.onSubmit = (newObject) => {
        const oldPrice = getPrice(element);
        const newPrice = getPrice(newObject);
        Object.assign(element, newObject);
        event.update(element);
        event.render();
        eventsContainer.replaceChild(event.element, eventEdit.element);
        eventEdit.unrender();
        if (oldPrice !== newPrice) {

          tripData.total = tripData.total - oldPrice + newPrice;
          header.update(tripData);
        }

      };

      eventEdit.onReset = () => {
        event.render();
        eventsContainer.replaceChild(event.element, eventEdit.element);
        eventEdit.unrender();
      };
      eventEdit.onDelete = () => {
        eventsContainer.removeChild(eventEdit.element);
        element.isDeleted = true;
        eventEdit.unrender();
      };
      eventsContainer.appendChild(event.render());
    });
};
