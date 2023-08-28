import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import pgPromise from "pg-promise";
import greeting from "./greet.js";
import makeQuery from "./service/query.js";
import routes from "./routes/routes.js";

const app = express();

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://greetings_webapp_pt29_user:fqH76pMt6QNdvzLyqc6eolSx9QTzv4tf@dpg-cjias4njbvhs73bpd4g0-a.oregon-postgres.render.com/greetings_webapp_pt29?ssl=true";
const pgp = pgPromise();
const db = pgp(connectionString);

const Greeting = greeting();

let datab = makeQuery(db);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

// routes module for handling routes
app.use("/", routes(Greeting, datab));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`App started at PORT: ${PORT}`);
});
