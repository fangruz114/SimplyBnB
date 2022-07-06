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
        stDate: new Date('2022-07-30'),
        edDate: new Date('2022-08-05'),
      },
      {
        spotId: 2,
        userId: 4,
        stDate: new Date('2022-08-15'),
        edDate: new Date('2022-08-18'),
      },
      {
        spotId: 5,
        userId: 7,
        stDate: new Date('2022-09-02'),
        edDate: new Date('2022-09-10'),
      },
      {
        spotId: 3,
        userId: 3,
        stDate: new Date('2023-01-14'),
        edDate: new Date('2023-01-16'),
      },
      {
        spotId: 1,
        userId: 5,
        stDate: new Date('2022-11-02'),
        edDate: new Date('2022-11-05'),
      },
      {
        spotId: 2,
        userId: 6,
        stDate: new Date('2022-12-21'),
        edDate: new Date('2023-01-03'),
      },
      {
        spotId: 4,
        userId: 7,
        stDate: new Date('2022-09-21'),
        edDate: new Date('2022-09-25'),
      },
      {
        spotId: 6,
        userId: 1,
        stDate: new Date('2022-10-07'),
        edDate: new Date('2022-10-10'),
      },
      {
        spotId: 6,
        userId: 5,
        stDate: new Date('2022-10-22'),
        edDate: new Date('2022-10-28'),
      },
      {
        spotId: 4,
        userId: 6,
        stDate: new Date('2022-10-10'),
        edDate: new Date('2022-10-12'),
      },
      {
        spotId: 5,
        userId: 1,
        stDate: new Date('2021-10-10'),
        edDate: new Date('2021-10-12'),
      },
      {
        spotId: 1,
        userId: 2,
        stDate: new Date('2022-06-28'),
        edDate: new Date('2021-07-15'),
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
