'use strict';
const {
  Model
} = require('sequelize');
const { answer } = require('../controllers/Student');
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //core.belongsTo(models.Student, { foreignKey: 'id' })
    }
  };
  Score.init({
    StudentId: DataTypes.INTEGER,
    QuizId: DataTypes.INTEGER,
    QuestionId: DataTypes.INTEGER,
    answer: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Score',
  });
  return Score;
};