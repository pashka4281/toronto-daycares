import { Sequelize, Model, DataTypes } from 'sequelize';

//const sequelize = new Sequelize('sqlite::memory:');
class Daycare extends Model {};

const fields = {
  name               : DataTypes.STRING,
  url                : DataTypes.STRING,
  address            : DataTypes.STRING,
  isSubsidy          : DataTypes.BOOLEAN,

  isVacancyInfant    : DataTypes.BOOLEAN,
  isVacancyToddler   : DataTypes.BOOLEAN,
  isVacancyPreschool : DataTypes.BOOLEAN,

  capacityInfant     : DataTypes.INTEGER,
  capacityToddler    : DataTypes.INTEGER,
  capacityPreschool  : DataTypes.INTEGER,

  ratingInfant       : DataTypes.INTEGER,
  ratingToddler      : DataTypes.INTEGER,
  ratingPreschool    : DataTypes.INTEGER,

  pageLastUpdatedAt  : DataTypes.DATEONLY,
};

module.exports = {
  klass: Daycare,
  fields: fields,
}
