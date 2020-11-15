'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Courses", {
      fields: ['LessonId'],
      type: 'foreign key',
      name: 'fkey_LessonId',
      references: {
        table: 'Lessons',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("Courses", "fkey_LessonId")
  }
};
