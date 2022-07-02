'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
      });
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      // validate: {
      //   afterOrOnToday(value) {
      //     if (Date.parse(value) <= new Date()) {
      //       throw new Error('start date cannot be before today.')
      //     }
      //   }
      // }
    },
    endDate: {
      type: DataTypes.DATE,
      validate: {
        afterStartDate(value) {
          if (Date.parse(value) <= Date.parse(this.startDate)) {
            throw new Error('end date must be after start date.')
          }
        }
      },
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
