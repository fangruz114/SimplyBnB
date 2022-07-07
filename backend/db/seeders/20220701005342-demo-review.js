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
    return queryInterface.bulkInsert('Reviews', [
      {
        userId: 2,
        spotId: 1,
        review: 'Very nice place',
        stars: parseInt(5),
      },
      {
        userId: 3,
        spotId: 1,
        review: 'It was an amazing and unforgettable experience.',
        stars: parseInt(4),
      },
      {
        userId: 4,
        spotId: 1,
        review: 'The invisible house is a magical place that I wish everyone could experience. There are high tech issues with the lights and ovens, etc so make sure you understand in your greeting. But you will have the experience of a lifetime!',
        stars: parseInt(5),
      },
      {
        userId: 5,
        spotId: 1,
        review: 'Awesome unique stay! Photos do not lie!',
        stars: parseInt(4),
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Was a great place - highly recommend!',
        stars: parseInt(4),
      },
      {
        userId: 5,
        spotId: 2,
        review: 'not worth that much money',
        stars: parseInt(2),
      },
      {
        userId: 6,
        spotId: 3,
        review: 'The location and unit were perfect. We had a great time!',
        stars: parseInt(5),
      },
      {
        userId: 4,
        spotId: 4,
        review: 'Beautiful and spacious condo, with luxurious decor! Huge balcony. Pools are great for all ages, we enjoyed the kids pools. Would love to come back!',
        stars: parseInt(5),
      },
      {
        userId: 5,
        spotId: 4,
        review: 'An incredibly stylized and extraordinary home. A wonderful stay and a lovely and accommodating host that left us fresh eggs from her hens!',
        stars: parseInt(4),
      },
      {
        userId: 1,
        spotId: 4,
        review: 'not clean',
        stars: parseInt(1),
      },
      {
        userId: 2,
        spotId: 5,
        review: 'great house. fully appointed. for us it eas absolutely magical. worth every single penny.',
        stars: parseInt(5),
      },
      {
        userId: 1,
        spotId: 6,
        review: 'his space is the perfect desert getaway! Can\'t wait to come back for another trip!',
        stars: parseInt(4),
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
    await queryInterface.bulkDelete('Reviews', {}, {});
  }
};
