'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Budgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Refers to the 'Users' table
          key: 'id'
        },
        onDelete: 'CASCADE', // Cascade delete when user is deleted
        onUpdate: 'CASCADE'  // Cascade updates to maintain referential integrity
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      budgetAmount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      month: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Budgets');
  }
};