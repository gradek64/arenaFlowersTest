const https = require('https');
const fs = require('fs').promises;
//custom
const api = 'https://restcountries.eu/rest/v2/region/europe'

//1 make request
const requestAPI = () =>
  new Promise((resolve, reject) => {
    https.get(api, (res) => {
      let data = '';
      if (res.statusCode > 200) {
        reject(`api response came back with code: ${res.statusCode}`);
      }
      res.on('data', (d) => (data += d));
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', (error) => reject(error));
    });
  });


//2 transform data;
const transformData = (data, countryArg) =>
  new Promise((resolve, reject) => {
    const dataBack = data.reduce((acc, { name, capital }) => {
      if(!name) return reject(`response does not come with country name`)
      const singleDoubleWordCountry = name.split(/\s/);
      if (
        singleDoubleWordCountry.some((word)=>word.toLowerCase() === countryArg.toLowerCase())
      ) {
        acc = { data: { name, capital } };
      }
      return acc 
    }, null);

    dataBack ? resolve(dataBack) : reject(`${countryArg} not found`);
  });


//3 writeToAndSave
const executeTasks = async (processArgs) => {
  //0 check for ags pass
  const [countryArg] = processArgs && [...processArgs].splice(2);
  if (!countryArg) {
    console.log('You need to pass arg to your script');
    return;
  }
  //1. requestAPI
  const result = await requestAPI().catch((e) => {
    throw new Error(e);
  });
  const resArray = Array.isArray(result)?result:[result];
  //2. transform data
  const tData = await transformData(resArray, countryArg).catch((e) => {
    throw new Error(e);
  });
  //3. writeToSaveFile
  await fs.writeFile(`./front-end/countriesData/${countryArg.toLowerCase()}.json`, JSON.stringify(tData));
  console.log('dataBack', tData);
};

executeTasks(process.argv);
