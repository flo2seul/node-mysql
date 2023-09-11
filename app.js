const express = require("express");
const path = require("path");

const app = express();

const db = require("./config/db.config");

const publicDirectroy = path.join(__dirname, "./public");
app.use(express.static(publicDirectroy));

// parse url encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
