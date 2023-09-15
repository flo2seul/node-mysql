const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });
const secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // read the token from header or url
  const cookie = req.headers["cookie"].match(
    new RegExp(
      "(?:^|; )" +
        "access".replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  )[1];

  const token = cookie || req.query.token;

  // token does not exist
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "not logged in",
    });
  }

  // create a promise that decodes the token
  const p = new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  // if it has failed to verify, it will return an error message
  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  // process the promise
  p.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};

module.exports = authMiddleware;
