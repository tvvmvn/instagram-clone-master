const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const passport = require("passport");
require("dotenv").config();


/* 
  * Authorization & Authentication
  
  1 JSON Web Token
  JSON formatted token(encrypted data)

  2 passport 
  auth module
*/
 

// options about JWT processing strategy
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";


// Strategy(algorithms) for JWT processing
const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);

    if (!user) {
      return done(null, false);
    }
    
    return done(null, user);

  } catch (err) {
    return done(err, false);
  }
})


passport.use(jwtStrategy);

module.exports = passport.authenticate("jwt", { session: false });
