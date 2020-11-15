'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Lessons", {
      fields: ['TeacherId'],
      type: 'foreign key',
      name: "fkey_TeacherId",
      references: {
        table: 'Teachers',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("Lessons", "fkey_TeacherId")
  }
};
