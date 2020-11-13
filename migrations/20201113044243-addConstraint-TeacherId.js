'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Students', {
      fields: ['TeacherId'],
      type: 'unique',
      name: 'custom_unique_TeacherId'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Students', 'custom_unique_TeacherId', {});
  }
};
