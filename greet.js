export default function Greet() {
  let greetCounter = 0;
  let users = [];
  let greetMsg = "";
  let errorMsg = "";
  const lettersOnlyRegex = /^[a-zA-Z]+$/;
  const namesCountMap = {};

  function peopleCounter(username) {
    const usernameTrimmed = username.trim();
    if (lettersOnlyRegex.test(usernameTrimmed) && !users.includes(usernameTrimmed.toLowerCase())) {
      greetCounter++;
      users.push(usernameTrimmed.toLowerCase());
    }
  }

  function greetUserWithLanguage(language, username) {
    if (username !== undefined) {
      const usernameTrimmed = username.trim();
      if (lettersOnlyRegex.test(usernameTrimmed)) {
        const arrName = usernameTrimmed.toLowerCase().split("");
        const [firstLetter, ...restOfLetters] = arrName;
        const capitalizeName = firstLetter.toUpperCase() + restOfLetters.join("");
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
      }
    }
  }

  function displayErrorMsg(username, language) {
    if (username !== undefined) {
      if (username === "") {
        errorMsg = "Please enter your name";
      } else if (language === undefined) {
        errorMsg = "Please select a language";
      } else if (username === "" && language === undefined) {
        errorMsg = "Please select a language and enter your name";
      } else if (username !== "" && language !== undefined) {
        errorMsg = "";
      }
    }
  }

  function resetCounter() {
    greetMsg = "";
    errorMsg = "";
    users = [];
    greetCounter = 0;
  }

  return {
    peopleCounter,
    greetUserWithLanguage,
    displayErrorMsg,
    resetCounter,
    userGreetedIn: () => greetMsg,
    currentErrorMsg: () => errorMsg,
    peopleGreeted: () => greetCounter,
    getGreetedUsers: () => users,
    getNamesCountMap: () => namesCountMap,
  };
}
