import Component from './component';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._label = data.label;
    this._onFilter = null;
    this._state = {
      isChecked: data.isChecked
    };

    this._inputElement = null;
    this._onFilterClickBound = this._onFilterClick.bind(this);
  }
  _onFilterClick() {
    return typeof this._onFilter === `function` && this._onFilter();
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `<input type="radio" id="filter-${this._label.toLowerCase()}" name="filter" value="${this._label.toLowerCase()}"${this._state.isChecked ? ` checked` : ``}>
  <label class="trip-filter__item" for="filter-${this._label.toLowerCase()}">${this._label}</label>`;
  }

  bind() {
    this._inputElement = this._element.querySelector(`input`);
    this._inputElement.addEventListener(`click`, this._onFilterClickBound);
  }

  unbind() {
    this._inputElement.removeEventListener(`click`, this._onFilterClickBound);
    this._inputElement = null;
  }

  render() {
    const element = document.createElement(`div`);
    element.innerHTML = this.template;

    const fragment = document.createDocumentFragment();
    element.childNodes.forEach((it) => fragment.appendChild(it));

    this._element = fragment;
    this.bind();
    return this._element;
  }
}
