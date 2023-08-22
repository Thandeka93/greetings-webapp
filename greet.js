import pgPromise from "pg-promise";
export default function Greeting(db) {
  let greetCounter = 0;
  let users = [];
  let greetMsg = "";
  let errorMsg = "";
  const alphabeticalRegex = /^[a-zA-Z]+$/;
  const namesCountMap = {};

  const pgp = pgPromise();
  // const db = pgp({
  //   host: "dpg-cjhn0u337aks738ri8bg-a",
  //   port: "5432",
  //   database: "greetings-webapp",
  //   user: "greetings_webapp_user",
  //   password: "yUhH6NHMRyi6ojr4JdURbfmjILoihuTK"
  // });  /* I should have a database connection details here */ 

  async function peopleCount(username) {
    const usernameTrimmed = username.trim();
    if (alphabeticalRegex.test(usernameTrimmed) && !users.includes(usernameTrimmed.toLowerCase())) {
      greetCounter++;
      users.push(usernameTrimmed.toLowerCase());
    }
    try {
      await db.none("UPDATE users SET user_counter = user_counter + 1 WHERE user_name = $1", [usernameTrimmed]);
  } catch (error) {
      console.error("Error updating user counter:", error);
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
        } else {
          return "";
        }
      }

    }
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
    greetMsg = "";
    errorMsg = "";
    users = [];
    greetCounter = 0;
    // Reset all user counters in the database
    try {
      await db.none("UPDATE users SET user_counter = 0");
  } catch (error) {
      console.error("Error resetting user counters:", error);
  }
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
