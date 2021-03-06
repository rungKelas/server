'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.belongsTo(models.Lesson)
      Course.hasMany(models.Quiz)
    }
  };
  Course.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `course name cannot be empty`
        }
      }
    },
    materialUrl: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `material url cannot be empty`
        }
      }
    },
    LessonId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};