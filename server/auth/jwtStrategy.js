const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

require('dotenv').config();

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

async function accessHandler(payload, done) {
  try {
    const user = await User.findById(payload.sub);

    if (!user) {
      return done(null, false);
    }
    
    return done(null, user);

  } catch (err) {
    return done(err, false);
  }
}

module.exports = new JwtStrategy(opts, accessHandler)
