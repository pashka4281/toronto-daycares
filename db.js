const { Sequelize, Model, DataTypes } = require('sequelize');
const path = require('path');
const fs   = require('fs');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

const models = [];
const modelsPath = path.join(__dirname, 'models');

fs.readdirSync(modelsPath).forEach(modelPath => {
  const modelDefinition = require(path.join(modelsPath, modelPath));
  modelDefinition.klass.init(modelDefinition.fields, {sequelize});
  models.push(modelDefinition.klass);
});


module.exports = {
  sequelize: sequelize,
  models,
};
