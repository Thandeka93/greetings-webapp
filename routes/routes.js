import express from "express";

const createRoutes = (Greeting, datab) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    req.flash("errorText", Greeting.currentErrorMsg());
    req.flash("shouldDisplayGreet", "false");

    const errorText = req.flash("errorText")[0];
    const name = Greeting.getName();
    const counts = await (await datab).peopleCount();
    const counter = Object.values(counts);

    const shouldDisplayError = req.flash("displayError")[0];
    if (shouldDisplayError) {
      setTimeout(() => {
        req.flash("errorText", "");
        req.flash("displayError", "false");
        res.redirect("/");
      }, 3000);
    } else {
      res.render("index", {
        greetMsg: Greeting.greetRecord(),
        name,
        counter,
        errorText,
        shouldDisplayError: Greeting.shouldDisplayError(),
      });
    }
  });

  router.get("/greeted", async (req, res) => {
    const userList = await (await datab).bring();
    res.render("greeted", { userList });
  });

  router.post("/greetings", async (req, res) => {
    const username = req.body.userInput;
    const language = req.body.language;
    Greeting.setName(username);

    if (!username || !language) {
      Greeting.displayErrorMsg(username, language);
      req.flash("errorText", Greeting.currentErrorMsg());
    } else {
      Greeting.userGreetLang(language, username);
      (await datab).insert(Greeting.getName());
      req.flash("errorText", "");
      Greeting.resetDisplayErrorFlag();
      req.flash("shouldDisplayGreet", "true");
      setTimeout(() => {
        req.flash("shouldDisplayGreet", "false");
      }, 4000);
    }

    res.redirect("/");
  });

  router.get("/counter/:user", async (req, res) => {
    let username = req.params.user;
    let nameCount = await (await datab).countGreetedUsers(username);
    res.render("counter", { nameCount, username });
  });

  router.post("/reset", async (req, res) => {
    Greeting.resetCounter();
    await (await datab).reset();
    res.redirect("/");
  });

  return router;
};

export default createRoutes;
