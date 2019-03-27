import Statistic from './statistic';

export default (tripdata , header, container) => {
  const statistic = new Statistic();

  container.appendChild(statistic.render());
}