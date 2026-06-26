'use strict';

/**
 * Seeds sample job_card rows and their related service_history rows.
 * service_history.job_card_id references job_card.id (numeric PK), and the
 * car_registration / client_mobile are denormalised so history is queryable
 * directly by vehicle or customer.
 */

const epoch = (iso) => new Date(iso).getTime();
const dateOnly = (iso) => iso.slice(0, 10);

const jobCards = [
  {
    id: 1,
    job_card_id: 'JC-2026-0001',
    car_registration: 'DL3CAB1234',
    client_mobile: '9028242267',
    customer_name: 'Rohit Sharma',
    car_vin: 'MA3ERLF1S00100001',
    total_amount: 2550,
    status: 'Completed',
    service_type: 'PMS',
    odometer: 15000,
    created_iso: '2026-06-20T09:15:00.000Z',
    services: [
      { description: 'Engine oil change (5W-30 synthetic)', amount: 1200 },
      { description: 'Oil filter replacement', amount: 350 },
      { description: 'Air filter cleaning', amount: 200 },
      { description: 'General labour charges', amount: 800 },
    ],
  },
  {
    id: 2,
    job_card_id: 'JC-2026-0002',
    car_registration: 'MH12XY9876',
    client_mobile: '9876543210',
    customer_name: 'Priya Nair',
    car_vin: 'MA3ERLF1S00100002',
    total_amount: 4100,
    status: 'Completed',
    service_type: 'Running Repair',
    odometer: 28000,
    created_iso: '2026-06-21T11:30:00.000Z',
    services: [
      { description: 'Front brake pad replacement', amount: 2500 },
      { description: 'Brake fluid top-up', amount: 300 },
      { description: 'Wheel alignment', amount: 600 },
      { description: 'Labour charges', amount: 700 },
    ],
  },
  {
    id: 3,
    job_card_id: 'JC-2026-0003',
    car_registration: 'KA05MN4567',
    client_mobile: '9123456780',
    customer_name: 'Arjun Rao',
    car_vin: 'MA3ERLF1S00100003',
    total_amount: 3350,
    status: 'Completed',
    service_type: 'AC Service',
    odometer: 41000,
    created_iso: '2026-06-22T08:45:00.000Z',
    services: [
      { description: 'AC gas refill (R134a)', amount: 1800 },
      { description: 'Cabin air filter replacement', amount: 650 },
      { description: 'AC cooling coil cleaning', amount: 900 },
    ],
  },
  {
    id: 4,
    job_card_id: 'JC-2026-0004',
    car_registration: 'UP14CD2233',
    client_mobile: '9988776655',
    customer_name: 'Vikram Singh',
    car_vin: 'MA3ERLF1S00100004',
    total_amount: 8650,
    status: 'Completed',
    service_type: 'PMS',
    odometer: 40000,
    created_iso: '2026-06-23T10:00:00.000Z',
    services: [
      { description: 'Periodic service (40,000 km)', amount: 4500 },
      { description: 'Spark plug replacement (set of 4)', amount: 1600 },
      { description: 'Coolant replacement', amount: 850 },
      { description: 'Wheel balancing', amount: 500 },
      { description: 'Labour charges', amount: 1200 },
    ],
  },
  {
    id: 5,
    job_card_id: 'JC-2026-0005',
    car_registration: 'TN09GH7788',
    client_mobile: '9001122334',
    customer_name: 'Karthik Iyer',
    car_vin: 'MA3ERLF1S00100005',
    total_amount: 9350,
    status: 'Completed',
    service_type: 'Repair',
    odometer: 62000,
    created_iso: '2026-06-24T09:30:00.000Z',
    services: [
      { description: 'Clutch plate replacement', amount: 6200 },
      { description: 'Clutch cable adjustment', amount: 400 },
      { description: 'Gear oil change', amount: 750 },
      { description: 'Labour charges', amount: 2000 },
    ],
  },
  {
    id: 6,
    job_card_id: 'JC-2026-0006',
    car_registration: 'GJ01JK5566',
    client_mobile: '9090909090',
    customer_name: 'Meena Patel',
    car_vin: 'MA3ERLF1S00100006',
    total_amount: 6250,
    status: 'Completed',
    service_type: 'Electrical',
    odometer: 33000,
    created_iso: '2026-06-24T13:10:00.000Z',
    services: [
      { description: 'Battery replacement (Exide 35Ah)', amount: 4800 },
      { description: 'Alternator belt replacement', amount: 950 },
      { description: 'Electrical wiring check', amount: 500 },
    ],
  },
  {
    id: 7,
    job_card_id: 'JC-2026-0007',
    car_registration: 'RJ14LP0099',
    client_mobile: '9445566778',
    customer_name: 'Sunita Rathore',
    car_vin: 'MA3ERLF1S00100007',
    total_amount: 8700,
    status: 'Completed',
    service_type: 'Tyre Service',
    odometer: 55000,
    created_iso: '2026-06-25T08:20:00.000Z',
    services: [
      { description: 'Tyre replacement (2 front)', amount: 7400 },
      { description: 'Wheel alignment & balancing', amount: 1100 },
      { description: 'Nitrogen filling', amount: 200 },
    ],
  },
  {
    id: 8,
    job_card_id: 'JC-2026-0008',
    car_registration: 'HR26QR3344',
    client_mobile: '9555544433',
    customer_name: 'Amit Khanna',
    car_vin: 'MA3ERLF1S00100008',
    total_amount: 5500,
    status: 'Completed',
    service_type: 'Detailing',
    odometer: 22000,
    created_iso: '2026-06-25T10:45:00.000Z',
    services: [
      { description: 'Full body wash & polish', amount: 1500 },
      { description: 'Interior vacuum & detailing', amount: 1200 },
      { description: 'Underbody anti-rust coating', amount: 2800 },
    ],
  },
];

module.exports = {
  async up(queryInterface) {
    const jobCardRows = jobCards.map((c) => ({
      id: c.id,
      job_card_id: c.job_card_id,
      car_registration: c.car_registration,
      client_mobile: c.client_mobile,
      customer_name: c.customer_name,
      car_vin: c.car_vin,
      total_amount: c.total_amount,
      status: c.status,
      created_at: epoch(c.created_iso),
      updated_at: null,
    }));

    const serviceHistoryRows = [];
    for (const c of jobCards) {
      for (const s of c.services) {
        serviceHistoryRows.push({
          job_card_id: c.id,
          car_registration: c.car_registration,
          client_mobile: c.client_mobile,
          service_type: c.service_type,
          description: s.description,
          amount: s.amount,
          service_date: dateOnly(c.created_iso),
          odometer: c.odometer,
          created_at: epoch(c.created_iso),
          updated_at: null,
        });
      }
    }

    await queryInterface.bulkInsert('job_card', jobCardRows);
    await queryInterface.bulkInsert('service_history', serviceHistoryRows);

    // Keep the auto-increment sequences ahead of the explicit ids we inserted.
    await queryInterface.sequelize.query(
      `SELECT setval(pg_get_serial_sequence('job_card', 'id'), (SELECT MAX(id) FROM job_card));`
    );
    await queryInterface.sequelize.query(
      `SELECT setval(pg_get_serial_sequence('service_history', 'id'), (SELECT MAX(id) FROM service_history));`
    );
  },

  async down(queryInterface) {
    const ids = jobCards.map((c) => c.id);
    await queryInterface.bulkDelete('service_history', { job_card_id: ids });
    await queryInterface.bulkDelete('job_card', { id: ids });
  },
};
