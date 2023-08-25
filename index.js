import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import pgPromise from "pg-promise";
import greeting from "./greet.js";
import makeQuery from "./service/query.js";

const app = express();

const connectionString = process.env.DATABASE_URL || 'postgres://greetings_webapp_pt29_user:fqH76pMt6QNdvzLyqc6eolSx9QTzv4tf@dpg-cjias4njbvhs73bpd4g0-a.oregon-postgres.render.com/greetings_webapp_pt29?ssl=true';  
// 'postgres://postgres:Thandeka@localhost:5432/greetings'

const pgp = pgPromise();  
const db = pgp(connectionString);

const Greeting = greeting();

let datab = makeQuery(db);


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

app.get("/", async function (req, res) {
    req.flash("errorText", Greeting.currentErrorMsg());
    const errorText = req.flash("errorText")[0]; // Retrieve the flash message
    const name = Greeting.getName()
    const counts = await (await datab).peopleCount();
    const counter = Object.values(counts)

    const shouldDisplayError = req.flash("displayError")[0];
    if (shouldDisplayError) {
        setTimeout(() => {
            req.flash("errorText", "");
            req.flash("displayError", "false"); // Reset the flag to false
            res.redirect("/");
        }, 3000);
    } else {

    res.render("index", {
        greetMsg: Greeting.greetRecord(),
        name,
        counter,
        errorText: errorText, // Pass the error message to the template
        shouldDisplayError: Greeting.shouldDisplayError(),
    });
}
});

app.get("/greeted", async (req, res) => {
    const userList = await (await datab).bring()

    res.render("greeted", { userList });
});

app.post("/greetings", async function (req, res) {
    const username = req.body.userInput;
    const language = req.body.language;
    Greeting.setName(username);
    
   
    if (!username || !language) {
        Greeting.displayErrorMsg(username, language);
        req.flash("errorText", Greeting.currentErrorMsg());
    } else {
        Greeting.userGreetLang(language, username);
        (await datab).insert(Greeting.getName());
        // Clear the error message when greeted successfully
        req.flash("errorText", "");
        Greeting.resetDisplayErrorFlag(); // Reset the display error flag
    
    }

    res.redirect("/");
});

app.get("/counter/:user", async (req, res) => {
    let username = req.params.user;
    let nameCount = await (await datab).countGreetedUsers(username);
    
        res.render("counter", { nameCount, username });

});

app.post("/reset",async (req, res) => {
    Greeting.resetCounter();
     await (await datab).reset();
    
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`App started at PORT: ${PORT}`);
});