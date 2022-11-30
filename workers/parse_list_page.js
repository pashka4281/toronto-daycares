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
  var table = $('#pfrBody > div > div.pfrPrdListing > table');
  table.find('tbody tr').each(function (i, row) {
    var linkElement = $(row).find('td:nth-child(1) a');
    var url         = new URL(linkElement.attr('href'), workerData.pageUrl).href;
    var name        = linkElement.text().trim();
    var isSubsidy   = $(row).find('td:nth-child(2)').text().trim() === 'Yes';
    data.push({name, url, isSubsidy});
  });
  //console.log(data.length, JSON.stringify(data, null, 4));
  await db.models.Daycare.bulkCreate(data, {
    fields: ['name', 'url', 'isSubsidy'],
    updateOnDuplicate: ['url']
  });
  await db.sequelize.close();
  parentPort.postMessage(data);
});

