'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Quizzes", {
      fields: ['CourseId'],
      type: 'foreign key',
      name: 'fkey_CourseId',
      references: {
        table: 'Courses',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("Quizzes", "fkey_CourseId")
  }
};