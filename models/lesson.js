'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Lesson.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `lesson name cannot be empty`
        }
      }
    },
    teacherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lesson',
  });
  return Lesson;
};