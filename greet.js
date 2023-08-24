export default function Greeting() {
  let greetCounter = 0;
  let users = [];
  let greetMsg = "";
  let errorMsg = "";
  let checkName = "";
  const namesCountMap = {};
  let lowercaseUsername = '';
  
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
    if (username !== undefined) {
      if (username === "") {
        errorMsg = "Please enter your name and select a language";
      } else if (language === undefined) {
        errorMsg = "Please select a language and enter your name";
      } else if (username === "" && language === undefined) {
        errorMsg = "Please select a language and enter your name";
      } else if (username !== "" && language !== undefined) {
        errorMsg = "";
      }
    }
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
    resetCounter,
    greetRecord: () => greetMsg,
    currentErrorMsg: () => errorMsg,
    peopleGreeted: () => greetCounter,
    getGreetedUsers: () => users,
    getUsageCount: () => namesCountMap,
  };
}
