// Функция возвращает случайное целое число из диапазона min, max

export const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

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
