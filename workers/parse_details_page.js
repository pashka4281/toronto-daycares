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
  const address = $('#pfrComplexDescr_sml > div:nth-child(1) > header > p').text().replaceAll(/\n|\t|(Ward: .{1,})/g, '').trim();
 
  const capacityInfant     = $('#pfrComplexDescr_sml > div.pfrListing > div > header > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(2)').text().trim();
  const capacityToddler    = $('#pfrComplexDescr_sml > div.pfrListing > div > header > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2)').text().trim();
  const capacityPreschool  = $('#pfrComplexDescr_sml > div.pfrListing > div > header > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(2)').text().trim();
  
  const isVacancyInfant    = $('#pfrComplexDescr_sml > div.pfrListing > div > header > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(3)').text().trim() === 'Yes';
  const isVacancyToddler   = $('#pfrComplexDescr_sml > div.pfrListing > div > header > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(3)').text().trim() === 'Yes';
  const isVacancyPreschool = $('#pfrComplexDescr_sml > div.pfrListing > div > header > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(3)').text().trim() === 'Yes';
  
  const ratingInfant       = $('#pfrComplexDescr_sml > div.pfrListing > div > header > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(4) > a').text().trim();
  const ratingToddler      = $('#pfrComplexDescr_sml > div.pfrListing > div > header > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4) > a').text().trim();
  const ratingPreschool    = $('#pfrComplexDescr_sml > div.pfrListing > div > header > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(4) > a').text().trim();

  const fields = {
    address,
    capacityInfant,
    capacityToddler,
    capacityPreschool,
    isVacancyInfant,
    isVacancyToddler,
    isVacancyPreschool,
    ratingInfant,
    ratingToddler,
    ratingPreschool,
  };
  console.log(fields)

  await db.models.Daycare.update(
    fields,
    { where: { url: workerData.pageUrl } }
  );
  await db.sequelize.close();
  parentPort.postMessage(fields);
});

