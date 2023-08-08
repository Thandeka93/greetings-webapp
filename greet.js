export default function Greet() {
  let greetCounter = 0;
  let users = [];
  let usernameTrimmed = "";
  let greetMsg = "";
  let errorMsg = "";
  let firstLetter, restOfLetters;
  const lettersOnlyRegex = /^[a-zA-Z]+$/;
  const namesCountMap = {};

  function peopleCounter(username) {
    usernameTrimmed = username.trim();
    if (lettersOnlyRegex.test(usernameTrimmed)) {
      if (!users.includes(usernameTrimmed.toLowerCase())) {
        greetCounter++;
        users.push(usernameTrimmed.toLowerCase());
      }
    }
  }
  function peopleGreeted() {
    return greetCounter;
  }
  function getGreetedUsers() {
    return users;
  }
  function greetUserWithLanguage(language, username) {
    if (username !== undefined) {
      usernameTrimmed = username.trim();
      if (lettersOnlyRegex.test(usernameTrimmed)) {
        let arrName = usernameTrimmed.toLowerCase().split("");
        [firstLetter, ...restOfLetters] = arrName;
        let capitalizeName = firstLetter.toUpperCase() + restOfLetters.join("");
        if (namesCountMap[username] === undefined) {
          namesCountMap[username] = 1;
        } else {
          namesCountMap[username]++;
        }
        if (language === "isiZulu") {
          greetMsg = `Sawubona ${capitalizeName}`;
        } else if (language === "English") {
          greetMsg = `Hello ${capitalizeName}`;
        } else if (language === "Spanish") {
          greetMsg = `Hola ${capitalizeName}`;
        }
      } else {
        return "";
      }
    }
  }

  function userGreetedIn() {
    return greetMsg;
  }
  function getNamesCountMap() {
    return namesCountMap;
  }
  function displayErrorMsg(username, language) {
    if (username !== undefined) {
      username === "" ? (errorMsg = "Please enter your name") : "";

      language === undefined ? (errorMsg = "Please select a language") : "";

      username === "" && language === undefined
        ? (errorMsg = "Please select a language and enter your name") : "";

      username !== "" && language !== undefined ? (errorMsg = "") : "";
    }
    
  }
  function currentErrorMsg() {
    return errorMsg;
  }

  function resetCounter() {
    greetMsg = "";
    errorMsg = "";
    users = [];
    return (greetCounter = 0);
  }

  return {
    peopleCounter,
    peopleGreeted,
    greetUserWithLanguage,
    displayErrorMsg,
    resetCounter,
    userGreetedIn,
    currentErrorMsg,
    getGreetedUsers,
    getNamesCountMap,
  };
}