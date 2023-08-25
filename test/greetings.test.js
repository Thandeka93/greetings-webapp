import assert from "assert";
import Greeting from '../greet.js';
import makeQuery from '../service/query.js';
import pgp from 'pg-promise';

describe('The basic database web app', function () {

  let db;

  before(function () {
    const connectionString = process.env.DATABASE_URL || 'postgres://greetings_webapp_pt29_user:fqH76pMt6QNdvzLyqc6eolSx9QTzv4tf@dpg-cjias4njbvhs73bpd4g0-a.oregon-postgres.render.com/greetings_webapp_pt29?ssl=true';
    db = pgp()(connectionString);
  });

  after(function () {
    db.$pool.end();
  });

  it('should test the insert', async function () {
    const queryUtility = makeQuery(db);

    (await queryUtility).insert('testUser');

  });

  it('should return distinct user names', async function () {
    // Mock database object and its methods
    const mockDb = {
      query: async (queryString) => {
        // Simulate database query and return mock data
        if (queryString === 'SELECT DISTINCT user_name FROM users') {
          return [
            { user_name: 'user1' },
            { user_name: 'user2' },
            { user_name: 'user3' }
          ];
        }
      },
      oneOrNone: async (queryString) => {
        // Simulate database query and return mock data
        if (queryString === 'SELECT COUNT(DISTINCT user_name) FROM users') {
          return { count: 3 };
        }
      }
    };

    // Create query utility instance
    const queryUtility = await makeQuery(mockDb);

    // Call the bring function
    const result = await queryUtility.bring();

  });

  it('should test reset function', async function () {
    this.timeout(10000); // Set a longer timeout for this test
    const queryUtility = await makeQuery(db);

    // Insert some test data before testing reset
    await queryUtility.insert('user1');
    await queryUtility.insert('user2');

    // Reset the database using the utility
    await queryUtility.reset();

    // Retrieve the distinct user names using the utility
    const users = await queryUtility.bring(); // Await the result
    assert.equal(users.length, 0);
  });

  it('should test countGreetedUsers function', async function () {
    const queryUtility = await makeQuery(db);

    // Insert test data before testing countGreetedUsers
    await queryUtility.insert('user1');
    await queryUtility.insert('user2');
    await queryUtility.insert('user2'); // Insert 'user2' twice

    // Count the user counter using the utility
    const userCounter = await queryUtility.countGreetedUsers('user2'); // Await the result
    assert.equal(userCounter.sum, 2); // Adjust the expected sum as needed
  });


});

describe('Greeting', () => {
  let greetingInstance;

  beforeEach(() => {
    greetingInstance = Greeting();
  });

  afterEach(() => {
    greetingInstance.resetCounter();
  });

  it('should greet in different languages', () => {
    greetingInstance.userGreetLang('English', 'Alice');
    assert.equal(greetingInstance.greetRecord(), 'Hello');
    greetingInstance.userGreetLang('isiZulu', 'Bob');
    assert.equal(greetingInstance.greetRecord(), 'Sawubona ');
    greetingInstance.userGreetLang('Spanish', 'Charlie');
    assert.equal(greetingInstance.greetRecord(), 'Hola');
  });

  it('should count people and maintain a names count map', () => {
    greetingInstance.userGreetLang('English', 'Alice');
    greetingInstance.userGreetLang('English', 'Bob');
    greetingInstance.userGreetLang('English', 'Alice'); // Repeated name
    const namesCountMap = greetingInstance.getUsageCount();
    assert.equal(namesCountMap['alice'], 2);
    assert.equal(namesCountMap['bob'], 1);
  });


  it('should track the number of people greeted', () => {
    greetingInstance.userGreetLang('English', 'Alice');
    greetingInstance.userGreetLang('English', 'Bob');
    assert.equal(greetingInstance.peopleGreeted(), 2);
  });



  it('should set and get the name', () => {
    greetingInstance.setName('Alice');
    assert.equal(greetingInstance.getName(), 'alice');
  });
});
