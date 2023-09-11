const db = require("../config/db.config");

let User = (user) => {
  this.user_id = user.user_id;
  this.user_email = user.user_email;
  this.user_name = user.user_name;
  this.user_password = user.user_password;
};

module.exports = User;
