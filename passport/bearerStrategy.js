const passport = require('passport');
const jwt = require('jsonwebtoken');
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('../models/userSchema');

passport.use(new BearerStrategy(async (token, done) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.user_id)
    if (!user) {
      return done(null, false);
    }
    return done(null, user, { scope: 'all' });
  }
  catch (err) {
    console.log(err);
    return done(err)
  }
}
));