'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 2,
        stDate: '2022-07-30',
        edDate: '2022-08-05',
      },
      {
        spotId: 2,
        userId: 4,
        stDate: '2022-08-15',
        edDate: '2022-08-18',
      },
      {
        spotId: 5,
        userId: 7,
        stDate: '2022-09-02',
        edDate: '2022-09-10',
      },
      {
        spotId: 3,
        userId: 3,
        stDate: '2023-01-14',
        edDate: '2023-01-16',
      },
      {
        spotId: 1,
        userId: 5,
        stDate: '2022-11-02',
        edDate: '2022-11-05',
      },
      {
        spotId: 2,
        userId: 6,
        stDate: '2022-12-21',
        edDate: '2023-01-03',
      },
      {
        spotId: 4,
        userId: 7,
        stDate: '2022-09-21',
        edDate: '2022-09-25',
      },
      {
        spotId: 6,
        userId: 1,
        stDate: '2022-10-07',
        edDate: '2022-10-10',
      },
      {
        spotId: 6,
        userId: 5,
        stDate: '2022-10-22',
        edDate: '2022-10-28',
      },
      {
        spotId: 4,
        userId: 6,
        stDate: '2022-10-10',
        edDate: '2022-10-12',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Bookings', {}, {});
  }
};
