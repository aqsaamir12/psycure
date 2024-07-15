const passport = require("passport");
// const Role = require("../models/roles.model");
const { JWT_SECRET } = require("../config/vars");
var jwt = require("jsonwebtoken");

/**
 * The therapistAuth middleware is used to authenticate user login attempts using the "login" strategy.
 * It handles user authentication, generates access tokens, and sets the user object in the request.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The callback function to continue with the request handling.
 *
 */
const therapistAuth = (req, res, next) => {
  passport.authenticate("therapistlogin", async (err, user, info) => {
    try {
      let flag = false;
      if (err || !user) {
        return res.status(403).json({
          message: info?.message || "An Error occurred",
          status: info?.status || 403,
        });
      }

      const existingUser = {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        age: user.age,
        id: user._id,
        certification: user.certification,
        yearsOfExp: user.yearsOfExp,
        profileImage: user.profileImage,
        isTherapist: true
      };

        flag = false;

        var accessToken = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            email:  user.email ,
            password: user.password,
          },
          JWT_SECRET
        );
      
      req.login(existingUser, { session: false }, async (error) => {
        if (error) return res.status(500).json({ status: 500 });
        // if (flag) {
        //   req.user = {
        //     user: existingUser,
        //     status: 400,
        //     success: false,
        //     message: info.message,
        //   };
        // }
         else {
          req.user = {
            user: existingUser,
            status: 200,
            success: true,
            message: info.message,
            accessToken,
          };
        }

        next();
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

module.exports = therapistAuth;
