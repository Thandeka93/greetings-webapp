import assert from "assert";
import Greeting from '../greet.js';


// Test suite for the Greet factory function
describe('Greeting', () => {
  let greetInstance;

  // Set up a new instance of Greet before each test
  beforeEach(() => {
    greetInstance = Greeting();
  });

  // Test the peopleCount function
  it('should increment the greetCounter and add users', () => {
    greetInstance.peopleCount('John');
    assert.strictEqual(greetInstance.peopleGreeted(), 1);
    assert.deepStrictEqual(greetInstance.getGreetedUsers(), ['john']);
  });

  // Test the userGreetLang function
  it('should greet the user in the specified language', () => {
    greetInstance.userGreetLang('English', 'Alice');
    assert.strictEqual(greetInstance.greetRecord(), 'Hello Alice');
  });


  // Test the resetCounter function
  it('should reset the greet counter and clear messages', () => {
    greetInstance.peopleCount('Alex');
    greetInstance.userGreetLang('isiZulu', 'David');
    greetInstance.resetCounter();
    assert.strictEqual(greetInstance.peopleGreeted(), 0);
    assert.deepStrictEqual(greetInstance.getGreetedUsers(), []);
    assert.strictEqual(greetInstance.greetRecord(), '');
    assert.strictEqual(greetInstance.currentErrorMsg(), '');
  });
});
