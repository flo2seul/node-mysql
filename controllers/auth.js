const jwt = require("../utils/jwt.util");
const bcrypt = require("bcryptjs");
const db = require("../config/db.config");

exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  db.query(
    "SELECT email FROM user WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.render("register", {
          message: "That email is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Password do not match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO user SET ?",
        {
          name,
          email,
          password: hashedPassword,
          created_at: new Date(),
        },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            return res.render("register", {
              message: "User registered!",
            });
          }
        }
      );
    }
  );
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT password FROM user WHERE email = ?",
    [email],
    (errors, result) => {
      const isMatched = bcrypt.compare(password, result);
      let info = { type: false, message: "" };
      if (isMatched) {
        const accessToken = jwt.sign(email);
        const refreshToken = jwt.refresh();
        info.type = true;
        info.message = "success";
        //redisClient.set(email, refreshToken);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Authorization", "Bearer " + accessToken);
        res.setHeader("Refresh", "Bearer " + refreshToken);
        res.cookie("access", accessToken, { httpOnly: true });
        return res.status(200).redirect("/");
        // .status(200)
        // .json({
        //   status: 200,
        //   info: info,
        //   token: {
        //     accessToken: accessToken,
        //     refreshToken: refreshToken,
        //   },
        // })
      } else {
        info.message = "비밀번호가 일치하지 않습니다.";
        return res.status(200).json({
          status: 403,
          info: info,
        });
      }
    }
  );
};
exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded,
  });
};
