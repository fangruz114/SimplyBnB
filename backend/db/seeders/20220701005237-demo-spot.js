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
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '47 W 13th St',
        city: 'New York',
        state: 'NY',
        country: 'United States of America',
        lat: 40.7367000,
        lng: -73.9963200,
        name: 'Architectural wonder in the woods',
        description: 'Unique experience ! Clean, Sanitize and secluded. Enjoy a weekend or a few days eco-friendly retreat in an architectural, geometric masterpiece on 30 preserved acres just minutes from all that Rhinebeck and the Hudson Valley have to offer. The house is an open plan, and though it has zero bedrooms, it can sleep 3!',
        price: 468.98,
        previewImage: 'https://a0.muscache.com/im/pictures/323b2430-a7fa-44d7-ba7a-6776d8e682df.jpg?im_w=1200',
      },
      {
        ownerId: 1,
        address: '22 Beehive Basin Rd',
        city: 'Gallatin Gateway',
        state: 'MT',
        country: 'United States of America',
        lat: 45.3028360,
        lng: -111.4096880,
        name: 'Hoos Views',
        description: 'Escape to the wilderness of the Spanish Peaks at this scenic ski lodge in Big Sky, Montana.',
        price: 2316.99,
        previewImage: 'https://a0.muscache.com/im/pictures/8796ca9b-fec7-429b-b94c-cb39213f90e8.jpg?im_w=1200',
      },
      {
        ownerId: 1,
        address: '53480 Del Gato Dr',
        city: 'La Quinta',
        state: 'CA',
        country: 'United States of America',
        lat: 35.6585500,
        lng: -116.3028400,
        name: 'Casa de Cala : Modern Adobe Retreat',
        description: 'Find your oasis in the desert at Casa de Cala - a thoughtfully designed, California-casual retreat in the scenic La Quinta Cove neighborhood.',
        price: 289.99,
        previewImage: 'https://a0.muscache.com/im/pictures/7deb6397-c3d1-4a07-a1f1-72731ef72065.jpg?im_w=1200',
      },
      {
        ownerId: 2,
        address: '8198 Uphill Rd',
        city: 'Joshua Tree',
        state: 'CA',
        country: 'United States of America',
        lat: 34.1051100,
        lng: -116.2857500,
        name: 'Invisible House Joshua Tree - Skyscraper with Pool',
        description: 'Quite simply, Invisible House is the most spectacular house in Joshua Tree.',
        price: 3294.99,
        previewImage: 'https://a0.muscache.com/im/pictures/d3f77c1a-c1aa-4adc-bdc1-85ee32eb291d.jpg?im_w=960',
      },
      {
        ownerId: 3,
        address: '3506 Hamstead Ct',
        city: 'Durham',
        state: 'NC',
        country: 'United States of America',
        lat: 35.9514423,
        lng: -78.9362585,
        name: 'Modern Tiny House in the Trees',
        description: 'You\'ll feel like you\'re getting away from it all in this brand new, private tiny house in the trees.',
        price: 228.46,
        previewImage: 'https://a0.muscache.com/im/pictures/miso/Hosting-35484995/original/283f31ae-5945-4d1e-ba67-66a020adde53.jpeg?im_w=960',
      },
      {
        ownerId: 4,
        address: '16 Quintana Dr',
        city: 'Galveston',
        state: 'TX',
        country: 'United States of America',
        lat: 29.2523798,
        lng: -94.8702352,
        name: 'Sweet Three By The Sea',
        description: 'Welcome to Sweet Three by the Sea! Enjoy the glamour of this stylish, upscale place and the comfort like no other.',
        price: 353.55,
        previewImage: 'https://a0.muscache.com/im/pictures/177b3fb2-7d2b-4b51-be71-296883713596.jpg?im_w=960',
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
    await queryInterface.bulkDelete('Spots', {}, {});
  }
};
