'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Questions", {
      fields: ['QuizId'],
      type: 'foreign key',
      name: 'fkey_QuizId',
      references: {
        table: 'Quizzes',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("Questions", "fkey_QuizId")
  }
};