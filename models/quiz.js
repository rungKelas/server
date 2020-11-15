'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Quiz.belongsTo(models.Course)
      Quiz.hasMany(models.Question)
    }
  };
  Quiz.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `quiz name cannot be empty`
        }
      }
    },
    CourseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};