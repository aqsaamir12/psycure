/**
 * contactUsQuery Controller
 *
 * This controller manages the application's contactUsQuery.
 * It provides endpoints for storing and retrieving application ContactUsQuery.
 *
 * @module controllers/ContactUsQuery.controller
 */
const ContactUs = require("../../model/contact.model");


/**
 * Handles contactUsQuery to creation a document in the database.
 * 
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 *
 */
exports.create = async (req, res, next) => {
    try {

        const { name, email, subject, message } = req.body;

        const newContact = new ContactUs({
          name,
          email,
          subject,
          message,
        });
    
        const savedContact = await newContact.save();
      res.status(200).json({
        success: true,
        status: 200,
        message: "Thanks for contacting us! We'll be in touch with you shortly.",
        savedContact,
      });
    } catch (error) {
      next(error);
    }
  };


  /**
 * Retrieves all ContactUsQueries from the database.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 *
 */
exports.get = async (req, res, next) => {
    try {
        const newContact = await ContactUs.find({});
      res.json({
        success: true,
        message: "Contact Fetched Successfully",
        newContact,
      });
    } catch (error) {
      next(error);
    }
  };