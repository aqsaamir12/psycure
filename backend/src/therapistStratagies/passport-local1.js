const { JWT_SECRET } = require("../config/vars");
const Therapist = require("../model/therapist.model");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

/**
 * Passport Configuration for User Authentication
 *
 * This module configures Passport.js for user authentication and authorization.
 * It defines two strategies: 'login' and 'JWTstrategy'.
 * 
 */

passport.use(
  "therapistlogin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await Therapist.findOne({ email: email });
        if (!user) {
          return done(null, false, {
            status: 404,
            success: false,
            message: "User not found",
          });
        }

        const loginUser = await user.verifyPassword(password);
        if (!loginUser)
          return done(null, false, { message: "Invalid Credentials", status: 401 });

        return done(null, user, {
          message: "Log in successfully",
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      try {
        const user = await Therapist.findOne({
          email: jwtPayload.email,
        });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
