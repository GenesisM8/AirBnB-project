'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
   
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User,{
        foreignKey:'ownerId'
      });

      Spot.hasMany(models.SpotImage,{
        foreignKey:'spotId',
        hooks: true,
        onDelete: 'CASCADE'
      });

      Spot.belongsToMany(models.User,{
        through: models.Booking,
        otherKey: 'userId',
        foreignKey: 'spotId',
        hooks: true,
        as:'Owner',
        onDelete: 'CASCADE'
      });

      Spot.belongsToMany(models.User, {
        through: models.Review,
        otherKey: 'userId',
        hooks: true,
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });


    }
  };
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};