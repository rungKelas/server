'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Scores', 'LessonId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Lessons',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Scores', 'LessinId')
  }
};
