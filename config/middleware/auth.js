const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req, res, next) => {
  try {
      

    const token = req.headers.authorization.split(' ')[1];
   console.log(token)
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    const userId = decodedToken.userId;
    //console.log(userId)
    //console.log(req.headers.userid+'hhhh')
    
     
    if (req.headers.userid && req.headers.userid !== userId) {
      throw 'Invalid user ID';

    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error
    });
  }
};