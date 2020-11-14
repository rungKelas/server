'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Question.init({
    questions: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `question cannot be empty`
        }
      }
    },
    choices: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      validate: {
        notEmpty: {
          args: true,
          msg: 'choices cannot be empty'
        }
      }
    },
    answer: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `answer cannot be empty`
        }
      }
    },
    quizId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};