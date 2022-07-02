'use strict';

const bcrypt = require('bcryptjs');

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
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Demo',
        lastName: 'Demo',
        username: 'DemoUser',
        email: 'demo@demo.io',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Chris',
        lastName: 'Hanley',
        username: 'chanley',
        email: 'Chris.Hanley@example.com',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Riley',
        lastName: 'Curry',
        username: 'rcurry',
        email: 'Riley.Curry@example.com',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Matt',
        lastName: 'Maya',
        username: 'mmaya',
        email: 'matt.maya@example.com',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Baker',
        lastName: 'Smith',
        username: 'bsmith',
        email: 'Baker.Smith@example.com',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Clark',
        lastName: 'Johnson',
        username: 'cjohnson',
        email: 'Clark.Johnson@example.com',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        firstName: 'Davis',
        lastName: 'Williams',
        username: 'dwilliams',
        email: 'Davis.Williams@example.com',
        hashedPassword: bcrypt.hashSync('password7')
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
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['DemoUser', 'chanley', 'rcurry', 'mmaya', 'bsmith', 'cjohnson', 'dwilliams'] }
    }, {});
  }
};
