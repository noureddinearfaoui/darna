const jwt = require("jsonwebtoken");

const User = require("../../user/model/user");

module.exports = (...permittedRoles) => {
  // return a middleware

  return (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
      const userId = decodedToken.userId;

      User.findById(userId)
        .then((user) => {
          if (user) {
            if (permittedRoles.includes(user.role)) {
              next(); // role is allowed, so continue on the next middleware
            } else {
              res.status(403).json({ message: "authorization" }); // user is forbidden
            }
          } else {
            res.status(403).json({ message: "authorization" }); // user is forbidden
          }
        })
        .catch((error) => {
          res.status(403).json({ message: error });
        });
    } catch (error) {
      res.status(401).json({
        error: "authorization",
      });
    }
  };
};
