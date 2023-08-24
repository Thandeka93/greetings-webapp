import assert from "assert";
import Greeting from '../greet.js';


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