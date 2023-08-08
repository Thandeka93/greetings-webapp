import assert from "assert";
import Greet from '../greet.js';


// Test suite for the Greet factory function
describe('Greet', () => {
  let greetInstance;

  // Set up a new instance of Greet before each test
  beforeEach(() => {
    greetInstance = Greet();
  });

  // Test the peopleCounter function
  it('should increment the greetCounter and add users', () => {
    greetInstance.peopleCounter('John');
    assert.strictEqual(greetInstance.peopleGreeted(), 1);
    assert.deepStrictEqual(greetInstance.getGreetedUsers(), ['john']);
  });

  // Test the greetUserWithLanguage function
  it('should greet the user in the specified language', () => {
    greetInstance.greetUserWithLanguage('English', 'Alice');
    assert.strictEqual(greetInstance.userGreetedIn(), 'Hello Alice');
  });


  // Test the resetCounter function
  it('should reset the greet counter and clear messages', () => {
    greetInstance.peopleCounter('Alex');
    greetInstance.greetUserWithLanguage('isiZulu', 'David');
    greetInstance.resetCounter();
    assert.strictEqual(greetInstance.peopleGreeted(), 0);
    assert.deepStrictEqual(greetInstance.getGreetedUsers(), []);
    assert.strictEqual(greetInstance.userGreetedIn(), '');
    assert.strictEqual(greetInstance.currentErrorMsg(), '');
  });

  // Test the getNamesCountMap function
  it('should return the names count map', () => {
    greetInstance.greetUserWithLanguage('English', 'Alice');
    greetInstance.greetUserWithLanguage('English', 'Alice');
    greetInstance.greetUserWithLanguage('Spanish', 'Bob');
    assert.deepStrictEqual(greetInstance.getNamesCountMap(), {
      'Alice': 2,
      'Bob': 1,
    });
  });
});
