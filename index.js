import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import greet from "./greet.js";

const app = express();
const Greet = greet();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(
    session({
        secret: "secret-key",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(flash());

app.get("/", function (req, res) {
    req.flash("errorText", Greet.currentErrorMsg());
    const errorText = req.flash("errorText")[0]; // Retrieve the flash message
    res.render("index", {
        greetMsg: Greet.greetRecord(),
        counter: Greet.peopleGreeted(),
        errorText: errorText, // Pass the error message to the template
    });
});

app.get("/greeted", (req, res) => {

    let usersArr = Greet.getGreetedUsers();
    res.render("greeted", { users: usersArr });
});

app.post("/greetings", function (req, res) {
    const username = req.body.userInput;
    const language = req.body.language;

    if (username && language) {
        Greet.userGreetLang(language, username);
        Greet.peopleCount(username);
        Greet.displayErrorMsg(username, language);
    } else {
        Greet.displayErrorMsg(username, language); // Display appropriate error message
    }

    res.redirect("/");
});

app.get("/counter/:currentUsername", (req, res) => {
    let user = req.params.currentUsername.toLowerCase();
    let howManyTimesGreeted = Greet.getUsageCount()[user];
    
    if (howManyTimesGreeted !== undefined) {
        const capitalizedUsername = user.charAt(0).toUpperCase() + user.slice(1);
        let userMsg = `Hello, ${capitalizedUsername} has been greeted ${howManyTimesGreeted} time${howManyTimesGreeted > 1 ? 's' : ''}`;
        res.render("greeted", { greetedTimesMsg: userMsg });
    } else {
        let userMsg = `Hello, ${user} has not been greeted yet`;
        res.render("greeted", { greetedTimesMsg: userMsg });
    }
});

app.post("/reset", (req, res) => {
    Greet.resetCounter();
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`App started at PORT: ${PORT}`);
});