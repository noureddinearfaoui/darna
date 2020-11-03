const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req, res, next) => {
  try {
    
    const decodedToken = jwt.verify(req.headers.authorization, process.env.DB_URL);
    const userId = decodedToken.userId;
    
    if (req.headers.userid !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch (error) {
      console.log('catch')
    res.status(401).json({
      error: error
    });
  }
};