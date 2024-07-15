
/**
 * User Controller
 *
 * This controller handles various operations related to users, including registration,
 * fetching, updating profile, changing password, and authentication.
 *
 * @module controllers/user.controller
 */

const { ObjectId } = require("mongoose").Types;
const userModel = require("../../model/user.model");
const therapistModel = require("../../model/therapist.model")
const fs = require("fs");
const path = require("path");
const { uploadFile, deleteFile } = require("../../utils/localFileUpload");

/**
 * Handles user registration.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */

exports.register = async (req, res, next) => {
    try {
     
        const payload = req.body;

        const existingUser = await userModel.findOne( {email: payload.email});

        if (existingUser) {
          return res.status(409).json({
            status: 409,
            success: false,
            message: "The user Already Exists",
          });
        }


        let user = await userModel.create(payload);
        user = { ...user.toObject() };
        delete user.password;
   
    
        res.status(201).json({ status: 201,
          success: true,
           message: 'User registered successfully', user});
    
      } catch (error) {
        next(error);
      }
    };


/**
 * Retrieve all therapists.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */

exports.get = async (req, res, next) => {
    try {
        const newTherapist = await therapistModel.find({}, '-password');
  
          res.status(200).json({
            status: 200,
            success: true,
            message: "User fetched Successfully",
            newTherapist,
          });
    } catch (error) {
        next(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

  /**
 * Register a new therapist.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
     exports.therapist = async (req, res, next) => {

    try {
      const { fname, lname, email, password, repassword, age, certification, yearsOfExp } = req.body;
  
      // Generate a salt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newTherapist = new therapistModel({
        fname,
        lname,
        email,
        password: hashedPassword, // Store the hashed password
        age,
        certification,
        yearsOfExp,
      });
  
      const savedTherapist = await newTherapist.save();
  
      res.status(201).json({ message: 'Therapist registered successfully', therapistId: savedTherapist._id });
    
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }

  };

  /**
 * Handle user login.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
  exports.login = async(req, res, next) => {
    try {
      if (!req.user) {
        res.status(500).json({ message: "Login failed", status: 500 });
      } else {
        const existingUser = await userModel.findOne({ email: req.user.user.email });
        if (!existingUser) {
          return res.status(404).json({ message: "User not found", status: 404 });
        }
        const newAccessToken = req.user?.accessToken;
  
        existingUser.token = newAccessToken;
        await existingUser.save();   
        res.status(200).json(req.user);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
 * Update user password.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
  exports.editPassword = async (req, res, next) => {
    try {
      let payload = req.body;
      let user = await userModel.findOne({ _id: new ObjectId(payload._id) });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
          success: false,
        });
      }
  
      if (payload?.new !== payload?.confirm) {
        return res.status(400).json({
          status: 400,
          message: "The password does not match the confirm password",
          success: false,
        });
      }
  
      const isPasswordValid = await user.verifyPassword(payload?.current);
      if (!isPasswordValid) {
        return res.status(400).json({
          status: 400,
          message: "The current password is incorrect",
          success: false,
        });
      }
  
      if (payload?.current === payload?.new) {
        return res.status(400).json({
          status: 400,
          message: "The new password cannot be the same as the previous password",
          success: false,
        });
      }
  
      user.password = payload.new;
      await user.save();
  
      res.status(200).json({
        status: 200,
        message: "Password updated successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
 * Retrieve user profile data.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
   exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        let userProfile;
        let isTherapist = true;

        // Check in therapistModel
        let therapistProfile = await therapistModel.findById(userId);
        if (therapistProfile) {
            userProfile = therapistProfile;
        } else {
            // Check in userModel if not found in therapistModel
            userProfile = await userModel.findById(userId).populate('personality', );
            isTherapist = false;
        }

        if (userProfile) {
            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                userProfile,
                isTherapist
            });
        } else {
            res.status(404).json({
                success: true,
                status: 404,
                message: 'User not found',
            });
        }
    } catch (error) {
        next(error);
    }
};

  
/**
 * Update user profile data.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
  exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        const userProfile = req.body;
        const uploadFolderPath = path.join(__dirname, "../../../uploads");
        const files = req.files;
        let user;

        // Check if the user is a therapist
        const therapist = await therapistModel.findById(userId);
        if (files && files?.profileImage) {
          if (!fs.existsSync(uploadFolderPath)) {
            fs.mkdirSync(uploadFolderPath, { recursive: true });
          }
          if (req?.files?.profileImage) {
            if (therapist?.profileImage) {
              deleteFile(uploadFolderPath, therapist?.profileImage);
            }
            const uploadedFile = await uploadFile(
              req.files.profileImage,
              uploadFolderPath
            );
            if (uploadedFile) {
              userProfile.profileImage = uploadedFile;
            }
          }
        }
        if (therapist) {
            // Update therapist details
            therapist.fname = userProfile?.fname;
            therapist.lname = userProfile?.lname;
            therapist.email = userProfile?.email;
            therapist.age = userProfile?.age;
            therapist.certification = userProfile?.certification;
            therapist.yearsOfExp = userProfile?.yearsOfExp;
            if (userProfile?.profileImage) {
                therapist.profileImage = userProfile?.profileImage
            }
            await therapist.save();
            user = therapist;
        } else {
            // Check if the user is a regular user
            user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            // Update user details
            user.fname = userProfile?.fname;
            user.lname = userProfile?.lname;
            user.email = userProfile?.email;
            user.age = userProfile?.age;
            if (userProfile?.profileImage) {
                user.profileImage = userProfile?.profileImage
            }

            await user.save();
        }

        res.json({
            success: true,
            status: 200,
            message: 'Your profile has been updated.',
            user
        });
    } catch (error) {
        next(error);
    }
};
