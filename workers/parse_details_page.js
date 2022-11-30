"use strict";
const { workerData, parentPort } = require('worker_threads');
const request = require('request');
const cheerio = require('cheerio');
const db      = require('../db');

//workerData.pageUrl // passed from the main thread
request(workerData.pageUrl, async function(error, response, body) {
  if (error) {
    console.log('Error: ' + error);
  }
  await db.sequelize.authenticate(); // trying connection to db
  //console.log('Status code: ' + response.statusCode);
  var $ = cheerio.load(body);
  var data = [];
  const address = $('#pfrComplexDescr_sml > div:nth-child(1) > header > p').text().replaceAll(/\n|\t|(Ward: .{1,})/g, '').trim();

  //console.log(data.length, JSON.stringify(data, null, 4));
  await Daycare.update({ address }, {
    where: {
      url: workerData.pageUrl
    }
  });
  await db.sequelize.close();
  parentPort.postMessage(data);
});

