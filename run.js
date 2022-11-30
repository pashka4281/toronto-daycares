const { Worker } = require('worker_threads');
//
Array.prototype.inGroupsOf = function(groupSize) {
  var arr, copy, e, group, res, _i, _len;
  arr = this;/*from   www  .ja  v a2  s  . c  o  m*/
  res = [];
  copy = [];
  while (arr.length > 0) {
    group = arr.splice(0, groupSize);
    res.push(group);
    copy = copy.concat(group);
  }
  for (_i = 0, _len = copy.length; _i < _len; _i++) {
    e = copy[_i];
    this.push(e);
  }
  return res;
};

const THREADS = 10;


const fetchListOfIndexPages = async function fetchListOfIndexPagesFn() {
  const request = require('request');
  const cheerio = require('cheerio');
  const url     = 'https://www.toronto.ca/data/children/dmc/a2z/a2za.html';

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

const refreshDetailsOfDaycares = async function refreshListOfDaycaresFn() {
  const db = require('./db');
  await db.sequelize.authenticate(); // trying connection to db
  const daycares = await db.models.Daycare.findAll();
  await db.sequelize.close();

  console.log('Total daycares in the DB:', daycares.length)
  const groups = daycares.inGroupsOf(THREADS);

  for (let i = 0; i < groups.length; i++) {
  //for (let i = 0; i < 1; i++) {
    //console.log('Group', groups[i]);
    await Promise.all(groups[i].map(daycare => __createWorker('parse_details_page', daycare.url)));
  }

};

async function init() {
  // create one single thread
  try {
    //await refreshListOfDaycares();
    await refreshDetailsOfDaycares();
  } catch(err) {
    console.log('failed to create a thread:', err);
  }
};

init();
