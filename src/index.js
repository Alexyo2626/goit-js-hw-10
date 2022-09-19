import API from './fetchCountries.js';
import Notiflix from 'notiflix';
import './css/styles.css';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'input',
  debounce(seachCountries, DEBOUNCE_DELAY)
);

function seachCountries() {
  clearMurkup();
  const searchQuery = refs.inputEl.value.trim();
  if (searchQuery) {
    API.fetchCountries(searchQuery)
      .then(appendCountriesMurkup)
      .catch(onFetchError);
  }
}

function onFetchError() {
  error => {
    console.log(error);
  };
}

function appendCountriesMurkup(country) {
  const totalCountries = country.length;

  if (totalCountries > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (totalCountries >= 2 && totalCountries <= 10) {
    refs.listEl.insertAdjacentHTML(
      'beforeend',
      createCountriesListMarkup(country)
    );
  } else if (totalCountries === 1) {
    refs.listEl.insertAdjacentHTML(
      'beforeend',
      createOneCountryoMarkup(country)
    );
  }
}

function createCountriesListMarkup(country) {
  return country
    .map(({ flags: { svg }, name: { official } }) => {
      return `
      <li class="coutry-list__item">
        <img src=${svg} alt="flag" width="80"></img>
        <h3 class="country-list__descr">${official}</p>
      </li>`;
    })
    .join('');
}

function createOneCountryoMarkup(country) {
  return country
    .map(
      ({
        flags: { svg },
        name: { official },
        capital,
        population,
        languages,
      }) => {
        return `
        <div class="subscription"><img src=${svg} alt="flag" width="150"></img>
        <h2 class="country-info__name">${official}</h2></div>
        <p class="country-info__descr">
          Capital: <span class="country-info__value">${capital}</span>
        </p>
        <p class="country-info__descr">
          Population: <span class="country-info__value">${population}</span>
        </p>
        <p class="country-info__descr">
          Languages: <span class="country-info__value">${Object.values(
            languages
          ).join(', ')}</span>
        </p>`;
      }
    )
    .join('');
}
function clearMurkup() {
  refs.countryInfoEl.innerHTML = '';
  refs.listEl.innerHTML = '';
}
