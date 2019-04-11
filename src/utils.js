// Функция возвращает элемент разметки из шаблона

export const createComponentElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const shake = (element, time) => {
  element.classList.add(`shake`);
  setTimeout(() => {
    element.classList.remove(`shake`);
  }, time);
};
