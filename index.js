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
    res.render("index", {
        greetMsg: Greet.userGreetedIn(),
        counter: Greet.peopleGreeted(),
    });
});

app.post("/greetings", function (req, res) {

    Greet.greetUserWithLanguage(req.body.language, req.body.userInput);
    Greet.peopleCounter(req.body.userInput);
    Greet.displayErrorMsg(req.body.userInput, req.body.language);

    res.redirect("/");
});

app.get("/greeted", (req, res) => {

    let usersArr = Greet.getGreetedUsers();
    res.render("greeted", { users: usersArr });
});

app.get("/counter/:currentUsername", (req, res) => {

    let user = req.params.currentUsername;
    let howManyTimesGreeted = Greet.getNamesCountMap()[user];
    let userMsg = `Hello, ${user} has been greeted ${howManyTimesGreeted} times`;
    res.render("greeted", { greetedTimesMsg: userMsg });
});

app.post("/reset", (req, res) => {
    Greet.resetCounter();
    res.redirect("/");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`App started at PORT: ${PORT}`);
});