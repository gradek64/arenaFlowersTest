//defer makes sure those are accessible 
const submitButton = document.querySelector('button[type="submit"]');
const findCountryInput = document.querySelector('input.findCountry');
const loadingStatus = document.querySelector('p.loading');
const resultsList = document.querySelector('.results');

let results = [];
const submitHandler = (input) => (e) => {
  e.preventDefault();
  const inputValue = input && input.value;
  loadingStatus.style.display = 'block';

  if (!inputValue) {
    loadingStatus.innerHTML = 'your search is empty';
    return;
  } else {
    loadingStatus.innerHTML = 'loading...';
  }

  fetch(`./countriesData/${inputValue}.json`)
    .then((result) => result)
    .then((toJson) => toJson.json())
    .then((response) => {
      const { name, capital } = response.data;
      console.log({ name, capital })
      const isOnList = results.some(
        ({ name: storeName }) => storeName === name,
      );
      if (isOnList) {
        loadingStatus.innerHTML = 'country already on the list';
        return;
      } else {
        results.push({ name, capital });
      }

      const listEntries = results.map(
        ({ name, capital }) => `<li class='entry' ><span>(country)</span> ${name} <span>(capital)</span> ${capital}</li>`,
      );
      resultsList.innerHTML = listEntries;
      loadingStatus.innerHTML = '';
    })
    .catch((e) => {
      loadingStatus.innerHTML = `${inputValue}.json does not exist`;
      console.error(e);
    });
};

window.onload = () => {
  submitButton.addEventListener('click', submitHandler(findCountryInput));
};
