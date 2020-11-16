'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Students', {
      fields: ['TeacherId'],
      type: 'foreign key',
      name: 'custom_fkey_constraint_TeacherId',
      references: {
        table: 'Teachers',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    //this is for test
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Students', 'custom_fkey_constraint_TeacherId');
  }
};
