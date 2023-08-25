export default function Greeting() {
  let greetCounter = 0;
  let users = [];
  let greetMsg = "";
  let errorMsg = "";
  let checkName = "";
  const namesCountMap = {};
  let lowercaseUsername = '';
  let displayError = false;
  
  async function peopleCount(username) {
    const usernameTrimmed = username.trim();
    const regex = /^[a-zA-Z]+$/;
    if (regex.test(usernameTrimmed) && !users.includes(usernameTrimmed.toLowerCase())) {
      // greetCounter++;
      users.push(usernameTrimmed.toLowerCase());
    }

  }

  function userGreetLang(language, username) {
    if (username !== undefined && language !== undefined) {
      const usernameTrimmed = username.trim();
      const alphabeticalRegex = /^[a-zA-Z]+$/;
      if (alphabeticalRegex.test(usernameTrimmed)) {
        lowercaseUsername = usernameTrimmed.toLowerCase();
        
        if (namesCountMap[lowercaseUsername] === undefined) {
         
          greetCounter++
          namesCountMap[lowercaseUsername] = 1;
        } else {
          namesCountMap[lowercaseUsername]++;
        }

        if (language === "isiZulu") {
          greetMsg = `Sawubona `;
        } else if (language === "English") {
          greetMsg = `Hello`;
        } else if (language === "Spanish") {
          greetMsg = `Hola`;
        } 
      }

    }
  }
  function getMap(){
    return namesCountMap;
  }

  function setName(uName){
    const regex = /^[a-zA-Z]+$/;
    let name = regex.test(uName);
    if(name){
      checkName = uName.toLowerCase()
    }
  }
  function getName(){
    return checkName;
  }

 
  function displayErrorMsg(username, language) {
    if (!username && !language) {
        errorMsg = "Please enter your name and select a language";
        displayError = true; // Set the flag to true for error display
    } else if (!username) {
        errorMsg = "Please enter your name";
        displayError = true; // Set the flag to true for error display
    } else if (!language) {
        errorMsg = "Please select a language";
        displayError = true; // Set the flag to true for error display
    } else {
        errorMsg = "";
        displayError = false; // Reset the flag
    }
}


    function shouldDisplayError() {
      return displayError;
  }

  function resetDisplayErrorFlag() {
    displayError = false;
}

  async function resetCounter() {
     greetCounter = 0;
    users = [];
    greetMsg = "";
    errorMsg = "";
    checkName = "";
    lowercaseUsername = '';
  
  }

  return {
    peopleCount,
    getMap,
    setName,
    getName,
    userGreetLang,
    displayErrorMsg,
    shouldDisplayError,
    resetDisplayErrorFlag,
    resetCounter,
    greetRecord: () => greetMsg,
    currentErrorMsg: () => errorMsg,
    peopleGreeted: () => greetCounter,
    getGreetedUsers: () => users,
    getUsageCount: () => namesCountMap,
  };
}
