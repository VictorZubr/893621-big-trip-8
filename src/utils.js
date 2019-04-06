// Функция возвращает случайное целое число из диапазона min, max

export const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

// Функция возвращает необходимое количество случайных элементов из массива

export const getRandomItems = (arr, count) => {

  // Получим count случайных индексов. Индексы не должны повторяться, поэтому используем Set

  const indexSet = new Set();
  while (indexSet.size < count) {
    indexSet.add(getRandomInteger(0, arr.length - 1));
  }
  return [...indexSet].map((element) => arr[element]);
};

// Функция фозвращает случайным образом true или false, с учетом коэффициента

export const getTrueOrFalse = (factor = 0.5) => ((Math.random() - 1 + factor) > 0);

// Функция возвращает элемент разметки из шаблона

export const createElement = (template) => {
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
