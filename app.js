const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const app = express();

const session = require("express-session");
const MySqlStore = require("express-mysql-session")(session);
const dbConfig = require("./config/db.config");
const db = mysql.createConnection(dbConfig);

const sessionStore = new MySqlStore(dbConfig);

const publicDirectroy = path.join(__dirname, "./public");
app.use(express.static(publicDirectroy));

// parse url encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "my secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "hbs");
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MYSQL Connected...");
  }
});

//Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(3000, () => {
  console.log("Server started on Port 3000");
});
