// Функция возвращает случайное целое число из диапазона min, max

export const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

// Функция возвращает необходимое количество случайных элементов из массива

export const getRandomItems = (arr, count) => arr.sort(() => (Math.random() - 0.5)).slice(0, count);

// Функция фозвращает случайным образом true или false, с учетом коэффициента

export const getTrueOrFalse = (factor = 0.5) => ((Math.random() - 1 + factor) > 0) ? true : false;
