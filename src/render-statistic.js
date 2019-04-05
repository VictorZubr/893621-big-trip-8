import Statistic from './statistic';
import {POINT_TYPES} from './const';
import {getPrice} from './render-trip';

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

const clipSortedItems = (arr, labels) => {
  const result = arr.map((it, index) => [it, labels[index]]).sort((a, b) => b[0] - a[0]);
  return result.slice(0, result.map((it) => it[0]).indexOf(0));
};

const getStatisticData = (events, pointTypes) => {
  const result = pointTypes
    .map((type) => events
      .filter((it) => !it.isDeleted)
      .reduce(([sum, count], event) => {
        [sum, count] = (event.type.name === type.name) ? [sum += getPrice(event), count += 1] : [sum, count];
        return [sum, count];
      }, [0, 0])
    );
  return [result.map((it) => it[0]), result.map((it) => it[1])];
};

export default (tripdata, header, container) => {
  container.innerHTML = ``;
  const [statSums, statCounts] = getStatisticData(tripdata.events, POINT_TYPES);

  const moneyStatisticData = getChartDataObject(clipSortedItems(statSums, POINT_TYPES), `money`);
  moneyStatisticData.formatter = `€ `;
  const moneyStatistic = new Statistic(moneyStatisticData);

  const transportStatisticData = getChartDataObject(
      clipSortedItems(statCounts, POINT_TYPES).filter((element) => element[1].text.lastIndexOf(` to`) > 0)
      , `transport`
  );
  transportStatisticData.formatter = ``;
  const transportStatistic = new Statistic(transportStatisticData);

  const moneyStatistic2 = new Statistic(moneyStatisticData);

  container.appendChild(moneyStatistic.render());
  container.appendChild(transportStatistic.render());
  container.appendChild(moneyStatistic2.render());
};
