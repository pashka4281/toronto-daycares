const { Worker } = require('worker_threads');
const db = require('./db');

// create one single thread
const listPageWorker = new Worker('./workers/parse_list_page.js', {
  workerData: {
    db,
    pageUrl: 'https://www.toronto.ca/data/children/dmc/a2z/a2za.html',
  }
});
listPageWorker.on('message', (data) => {
  console.log("WORKER DATA", data)
});
worker.on('error', (msg) => {
  //res.status(404).send(`An error occurred: ${msg}`);
});
