'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_history', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      job_card_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'job_card',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      // Denormalised user identifiers so service history can be queried directly
      // by car registration or client mobile without joining job_card.
      car_registration: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      client_mobile: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      service_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      service_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      odometer: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

    await queryInterface.addIndex('service_history', ['job_card_id'], {
      name: 'service_history_job_card_id_idx',
    });

    await queryInterface.addIndex('service_history', ['car_registration'], {
      name: 'service_history_car_registration_idx',
    });

    await queryInterface.addIndex('service_history', ['client_mobile'], {
      name: 'service_history_client_mobile_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('service_history');
  },
};
