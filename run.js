const { Worker } = require('worker_threads');
//const db = require('./db');
//

const THREADS = 10;

const request = require('request');
const cheerio = require('cheerio');

const fetchListOfIndexPages = async function fetchListOfIndexPagesFn() {
  const url = 'https://www.toronto.ca/data/children/dmc/a2z/a2za.html';
  return new Promise((resolve, reject) => {
    request(url, async function(error, response, body) {
      if (error) {
        return reject(error);
      }
      //console.log('Status code: ' + response.statusCode);
      const $ = cheerio.load(body);
      const links = Array.from($('ul.phone a')).map(x => new URL($(x).prop('href'), url).href);
      
      resolve(links);
    });
  });
};

const __createWorker = function createWorkerFn(workerName, pageUrl) {
  return new Promise((resolve, reject) => {
    const listPageWorker = new Worker(`./workers/${workerName}.js`, {
      workerData: { pageUrl }
    });
    listPageWorker.on('message', data => resolve(data));
    listPageWorker.on('error', msg => reject(msg));
  });
};


const refreshListOfDaycares = async function refreshListOfDaycaresFn() {
  const indexPageUrls = await fetchListOfIndexPages();
  console.log('Number of pages:', indexPageUrls.length);
  await Promise.all(indexPageUrls.map(url => __createWorker('parse_list_page', url)));
};


async function init() {
  // create one single thread
  try {
    //await refreshListOfDaycares();
  } catch(err) {
    console.log('failed to create a thread:', err);
  }
};

init();
