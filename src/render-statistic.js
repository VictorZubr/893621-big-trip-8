import Statistic from './statistic';
import {MILLISECONDS_IN_HOUR, POINT_TYPES} from './const';
import {getPrice} from './render-trip';

const StatConfig = {
  MONEY: {title: `money`, formatter: `€ X`},
  TRANSPORT: {title: `transport`, formatter: `X x`},
  TIME: {title: `time spent`, formatter: `XH`},
};

const getChartDataObject = (data, name) => ({
  title: name,
  formatter: data.formatter,
  data: {
    labels: data.map((element) => element[1].icon + ` ` + element[1].name),
    datasets: [{
      data: data.map((element) => element[0]),
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  }
});

const getChartTimeDataObject = (data, name) => ({
  title: name,
  formatter: data.formatter,
  data: {
    labels: data.map((element) => element[1].name),
    datasets: [{
      data: data.map((element) => element[0]),
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  }
});

const clipSortedItems = (arr, labels) => {
  const result = arr.map((it, index) => [it, labels[index]]).sort((a, b) => b[0] - a[0]);
  return result.slice(0, result.map((it) => it[0]).indexOf(0));
};

const getStatisticData = (events, pointTypes) => {
  const result = pointTypes
    .map((type) => events
      .filter((it) => !it.isDeleted)
      .reduce(([sum, count], event) => {
        // За один проход формируем два значения для статистики
        const [sumAdd, countAdd] = (event.type.name === type.name) ? [getPrice(event), 1] : [0, 0];
        sum += sumAdd;
        count += countAdd;
        return [sum, count];
      }, [0, 0])
    );
  // Из массива пар значений [[X, Y], [X1, Y1]...] делаем два массива [[X, X1,...], [Y, Y1,...]]
  return [result.map((it) => it[0]), result.map((it) => it[1])];
};

const getTimeStatisticData = (events, destinations) => destinations
    .map((destination) => events
      .filter((it) => !it.isDeleted)
      .reduce((duration, event) => {
        duration += (event.title === destination.name) ? (event.dateEnd - event.dateBegin) / MILLISECONDS_IN_HOUR : 0;
        return duration;
      }, 0)
    ).map((it) => Math.trunc(it));

export default (tripData, header, container) => {
  container.innerHTML = ``;
  const [statSums, statCounts] = getStatisticData(tripData.events, POINT_TYPES);

  const moneyStatisticData = getChartDataObject(clipSortedItems(statSums, POINT_TYPES), StatConfig.MONEY.title);
  moneyStatisticData.formatter = StatConfig.MONEY.formatter;
  const moneyStatistic = new Statistic(moneyStatisticData);

  // Выбираем только те типы событий, которые отвечают за транспорт (в конце поля text у них содержится ` to`
  const transportStatisticData = getChartDataObject(clipSortedItems(statCounts, POINT_TYPES)
    .filter((element) => element[1].text.lastIndexOf(` to`) > 0), StatConfig.TRANSPORT.title);
  transportStatisticData.formatter = StatConfig.TRANSPORT.formatter;
  const transportStatistic = new Statistic(transportStatisticData);

  const times = getTimeStatisticData(tripData.events, tripData.destinations);
  const timeStatisticData = getChartTimeDataObject(clipSortedItems(times, tripData.destinations), StatConfig.TIME.title);
  timeStatisticData.formatter = StatConfig.TIME.formatter;
  const timeStatistic = new Statistic(timeStatisticData);

  container.appendChild(moneyStatistic.render());
  container.appendChild(transportStatistic.render());
  container.appendChild(timeStatistic.render());
};
