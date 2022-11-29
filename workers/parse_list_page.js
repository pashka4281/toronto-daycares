"use strict";
const { workerData, parentPort } = require('worker_threads');
var request = require('request');
var cheerio = require('cheerio');
//
//workerData.db      // passed from the main thread
//workerData.pageUrl // passed from the main thread
//const pageUrl = 'https://www.toronto.ca/data/children/dmc/a2z/a2za.html';

request(workerData.pageUrl, function(error, response, body) {
  if (error) {
    console.log('Error: ' + error);
  }
  console.log('Status code: ' + response.statusCode);

  var $ = cheerio.load(body);
  var data = [];
  var table = $('#pfrBody > div > div.pfrPrdListing > table');
  table.find('tbody tr').each(function (i, row) {
    var linkElement   = $(row).find('td:nth-child(1) a');
    var url           = new URL(linkElement.attr('href'), workerData.pageUrl).href;
    var schoolName    = linkElement.text().trim();
    var isFeeAccepted = $(row).find('td:nth-child(2)').text().trim() === 'Yes';
    data.push([schoolName, url, isFeeAccepted]);
  });

  console.log(JSON.stringify(data, null, 4));
  parentPort.postMessage(data);
});

