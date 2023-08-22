import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import pgPromise from "pg-promise";
import greeting from "./greet.js";

const app = express();

const connectionString = process.env.DATABASE_URL || 'postgres://greetings_webapp_pt29_user:fqH76pMt6QNdvzLyqc6eolSx9QTzv4tf@dpg-cjias4njbvhs73bpd4g0-a/greetings_webapp_pt29';
const pgp = pgPromise();
// const db = pgp({
//     host: "dpg-cjhn0u337aks738ri8bg-a",
//     port: "5432",
//     database: "greetings-webapp",
//     user: "greetings_webapp_user",
//     password: "yUhH6NHMRyi6ojr4JdURbfmjILoihuTK"
// });  
const db = pgp(connectionString);

const Greeting = greeting(db);


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
    req.flash("errorText", Greeting.currentErrorMsg());
    const errorText = req.flash("errorText")[0]; // Retrieve the flash message
    res.render("index", {
        greetMsg: Greeting.greetRecord(),
        counter: Greeting.peopleGreeted(),
        errorText: errorText, // Pass the error message to the template
    });
});

app.get("/greeted", (req, res) => {
    let userList = Greeting.getGreetedUsers();
    res.render("greeted", { users: userList });
});

app.post("/greetings", function (req, res) {
    const username = req.body.userInput;
    const language = req.body.language;

    if (username && language) {
        Greeting.userGreetLang(language, username);
        Greeting.peopleCount(username);
        Greeting.displayErrorMsg(username, language);
    } else {
        Greeting.displayErrorMsg(username, language); // Display appropriate error message
    }

    res.redirect("/");
});

app.get("/counter/:currentUsername", (req, res) => {
    let user = req.params.currentUsername.toLowerCase();
    let howManyTimesGreeted = Greeting.getUsageCount()[user];

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
    Greeting.resetCounter();
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`App started at PORT: ${PORT}`);
});