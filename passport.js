const passport = require('passport');
const jwt = require('jsonwebtoken');
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('./models/userSchema');

passport.use(new BearerStrategy(
    function(token, done) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        User.findById(decoded.user_id, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'all' });
      });
    }
  ));