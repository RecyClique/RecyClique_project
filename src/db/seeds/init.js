const User = require('../models/user');
const Event = require('../models/event');
const UserEvent = require('../models/user_event');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  // Users
  await User.deleteAll();
  await User.create(
    "Jason",
    "Paulino",
    "jasonpaulino",
    "jasonp0830@gmail.com",
    "123",
  );
  await User.create(
    "Randy",
    "Pichardo",
    "randypichardo",
    "randypichardo1987@gmail.com",
    "123",
  );
  await User.create(
    "Staceyann",
    "King",
    "staceyannking",
    "staceyannking01@gmail.com",
    "123",
  );
  await User.create(
    "Magdalena",
    "Gero",
    "magdalenagero",
    "magdalenamgero@gmail.com",
    "123",
  );
  await User.create(
    "Shaina",
    "Guzman",
    "shainaguzman",
    "shainaguzman0624@gmail.com",
    "123",
  );

  // Events
  await Event.deleteAll();
  // Events
  await Event.deleteAll();

  await Event.create(
    1,
    "Cleanup",
    "Park Cleanup",
    new Date(2023, 6, 12), // July 12, 2023
    new Date(2023, 6, 12), // July 12, 2023
    "10:00:00", // 10 AM
    "14:00:00", // 2 PM
    "Central Park",
    "Manhattan",
    "Join us for a cleanup event at Central Park. Bring your friends!",
    "https://upload.wikimedia.org/wikipedia/commons/1/13/Central_Park_-_The_Pond_%2848377220157%29.jpg"
  );

  await Event.create(
    1,
    "Exchange",
    "Book Exchange",
    new Date(2023, 6, 20), // July 20, 2023
    new Date(2023, 6, 21), // July 21, 2023
    "15:00:00", // 3 PM
    "19:00:00", // 7 PM
    "Brooklyn Library",
    "Brooklyn",
    "Join us for a book exchange event at Brooklyn Library. Bring books you'd like to swap!",
    "https://static.wixstatic.com/media/090274_561e59af171f4fb9b54b0992b442e70b~mv2.jpg/v1/fit/w_320%2Ch_765%2Cal_c%2Cq_80,enc_auto/file.jpg"
  );

  await Event.create(
    2,
    "Cleanup",
    "Beach Cleanup",
    new Date(2023, 7, 15), // August 15, 2023
    new Date(2023, 7, 15), // August 15, 2023
    "08:00:00", // 8 AM
    "12:00:00", // 12 PM
    "Coney Island Beach",
    "Brooklyn",
    "Join us for a cleanup event at Coney Island Beach. Let's save our oceans!",
    "https://live.staticflickr.com/3188/2743676819_820fab6c80_b.jpg"
  );

  await Event.create(
    3,
    "Exchange",
    "Clothes Exchange",
    new Date(2023, 8, 30), // September 30, 2023
    new Date(2023, 8, 30), // September 30, 2023
    "11:00:00", // 11 AM
    "15:00:00", // 3 PM
    "Times Square",
    "Manhattan",
    "Join us for a clothes exchange event at Times Square. Bring clothes you'd like to swap!",
    "https://cdn.shopify.com/s/files/1/0648/0828/8508/products/image_581d1fe7-adcf-45ad-b691-8f33dbc2615f.jpg?v=1687365317&width=1440"
  );

  await Event.create(
    4,
    "Cleanup",
    "Street Cleanup",
    new Date(2023, 9, 5), // October 5, 2023
    new Date(2023, 9, 5), // October 5, 2023
    "09:00:00", // 9 AM
    "13:00:00", // 1 PM
    "Broadway",
    "Manhattan",
    "Join us for a cleanup event at Broadway. Let's keep our city clean!",
    "https://nypost.com/wp-content/uploads/sites/2/2020/09/one-block-uws-4.jpg?quality=75&strip=all"
  );

  // User Events
  await UserEvent.deleteAll();
  await UserEvent.create(2, 1); // User 2 joins Event 1
  await UserEvent.create(2, 2); // User 2 joins Event 2
  await UserEvent.create(3, 1); // User 3 joins Event 1
  await UserEvent.create(4, 2); // User 4 joins Event 2
  await UserEvent.create(5, 2); // User 5 joins Event 2
};
