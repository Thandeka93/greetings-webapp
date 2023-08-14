export default function Greet() {
  let greetCounter = 0;
  let users = [];
  let greetMsg = "";
  let errorMsg = "";
  const alphabeticalRegex = /^[a-zA-Z]+$/;
  const namesCountMap = {};

  function peopleCount(username) {
    const usernameTrimmed = username.trim();
    if (alphabeticalRegex.test(usernameTrimmed) && !users.includes(usernameTrimmed.toLowerCase())) {
      greetCounter++;
      users.push(usernameTrimmed.toLowerCase());
    }
  }

  function userGreetLang(language, username) {
    if (username !== undefined && language !== undefined) {
      const usernameTrimmed = username.trim();
      if (alphabeticalRegex.test(usernameTrimmed)) {
        const lowercaseUsername = usernameTrimmed.toLowerCase();
        const capitalizedUsername = lowercaseUsername.charAt(0).toUpperCase() + lowercaseUsername.slice(1);
        if (namesCountMap[lowercaseUsername] === undefined) {
            namesCountMap[lowercaseUsername] = 1;
        } else {
            namesCountMap[lowercaseUsername]++;
        }
    
        const arrName = lowercaseUsername.split(""); // Use lowercase version for name manipulation
        const [firstLetter, ...restOfLetters] = arrName;
        const capitalizeName = firstLetter.toUpperCase() + restOfLetters.join("");
    
        if (language === "isiZulu") {
            greetMsg = `Sawubona ${capitalizedUsername}`;
        } else if (language === "English") {
            greetMsg = `Hello ${capitalizedUsername}`;
        } else if (language === "Spanish") {
            greetMsg = `Hola ${capitalizedUsername}`;
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
    peopleCount,
    userGreetLang,
    displayErrorMsg,
    resetCounter,
    greetRecord: () => greetMsg,
    currentErrorMsg: () => errorMsg,
    peopleGreeted: () => greetCounter,
    getGreetedUsers: () => users,
    getUsageCount: () => namesCountMap,
  };
}
