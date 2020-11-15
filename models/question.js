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
      Question.belongsTo(models.Quiz)
    }
  };
  Question.init({
    question: {
      type: DataTypes.STRING, 
      validate: {
        notEmpty: {
          args: true,
          msg: `question cannot be empty`
        },
        notNull: {
          args: true,
          msg: `question cannot be empty`
        }
      },
      allowNull: false
    },
    choices: {
      type: DataTypes.ARRAY(DataTypes.STRING), 
      validate: {
        notEmpty: {
          args: true,
          msg: `choices cannot be empty`
        },
        notNull: {
          args: true,
          msg: `choices cannot be empty`
        }
      },
      allowNull: false
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
    QuizId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};