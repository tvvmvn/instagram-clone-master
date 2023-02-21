const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

require('dotenv').config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {

    const user = await User.findOne({ username: jwt_payload.username });

    if (!user) {
      return done(null, false);
    }
    
    return done(null, user);

  } catch (err) {
    done(err, false);
  }
})

module.exports = jwtStrategy;

