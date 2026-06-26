'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job_card', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      job_card_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      car_registration: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      client_mobile: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      customer_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      car_vin: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM('Open', 'In-Progress', 'Completed', 'Disputed', 'Corrected'),
        allowNull: false,
        defaultValue: 'Open',
      },
      created_at: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000'),
      },
      updated_at: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('job_card', ['job_card_id'], {
      name: 'job_card_job_card_id_idx',
      unique: true,
    });

    await queryInterface.addIndex('job_card', ['car_registration'], {
      name: 'job_card_car_registration_idx',
    });

    await queryInterface.addIndex('job_card', ['client_mobile'], {
      name: 'job_card_client_mobile_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('job_card');
    // Clean up the ENUM type created for the status column
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_job_card_status";');
  },
};
