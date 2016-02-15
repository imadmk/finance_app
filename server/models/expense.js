'use strict';
module.exports = function(sequelize, DataTypes) {
  var Expense = sequelize.define('Expense', {
    name: {
        type: DataTypes.STRING,
        validate: {notEmpty: true}
        },
    amount: {
        type: DataTypes.DECIMAL(19,2),
        validate: {
            isNumeric: true
        },
        defaultValue: 0
    },
    date: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Expense;
};