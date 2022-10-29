import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

const divEl = document.querySelector('.country-info');
const listEl = document.querySelector('.country-list');

function onSearch(evt) {
  const countriname = evt.target.value.trim();
  if (countriname === '') {
    divEl.innerHTML = '';
    listEl.innerHTML = '';
    return;
  }

  fetchCountries(countriname)
    .then(response => {
      if (response.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      renderMarkup(response);
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

const renderMarkup = data => {
  if (data.length === 1) {
    listEl.innerHTML = '';
    divEl.innerHTML = countryInfoMarkup(data);
    return;
  } else {
    divEl.innerHTML = '';
    listEl.innerHTML = countryListMarkup(data);
  }
};

const countryListMarkup = data =>
  data
    .map(
      ({ name, flags }) => `<li class="country-list__elem">
        <img class="country-list__img" src="${flags.png}" alt="${name.official} " width="80px" height="50px"/>
        <h2 class="country-list__title">${name.official}</h2>
        </li>`
    )
    .join('');

const countryInfoMarkup = data =>
  data
    .map(
      ({ name, capital, population, flags, languages }) =>
        ` <img class="country-info__img" src="${flags.png}" alt="${
          name.official
        } " width="200px" height="100px"/><h2 class="country-info__title">${
          name.official
        }</h2>
      <p class="country-info__text">Capital: <span class="country-info__text--color">${capital}</span></p>
      <p class="country-info__text">Population: <span class="country-info__text--color">${population}</span></p>
      <p class="country-info__text">Languages: <span class="country-info__text--color">${Object.values(
        languages
      )}</span></p>`
    )
    .join('');
