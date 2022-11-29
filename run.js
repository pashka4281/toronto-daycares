const { Worker } = require('worker_threads');
//const db = require('./db');


const createListPageWorker = function createListPageWorkerFn(pageUrl) {
  return new Promise((resolve, reject) => {
    const listPageWorker = new Worker('./workers/parse_list_page.js', {
      workerData: {
        //db,
        pageUrl
      }
    });
    listPageWorker.on('message', (data) => resolve(data));
    listPageWorker.on('error', (msg) => reject(msg));
  });
}

async function init() {
  // create one single thread
  try {
    const data = await createListPageWorker('https://www.toronto.ca/data/children/dmc/a2z/a2za.html');
    console.log('WORKER DATA', data);
  } catch(err) {
    console.log('failed to create a thread:', err);
  }
};

init();
