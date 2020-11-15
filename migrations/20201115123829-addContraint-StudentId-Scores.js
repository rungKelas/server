'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Scores', {
      fields: ['StudentId'],
      type: 'foreign key',
      name: 'custom_fkey_constraint_StudentId',
      references: {
        table: 'Students',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Scores', 'custom_fkey_constraint_StudentId');
  }
};
