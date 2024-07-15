const { ObjectId } = require("mongoose").Types;
const serviceModel = require("../../model/service.model")
const therapistModel = require("../../model/therapist.model")
const appointmentFeedbackModel = require("../../model/appointment_feedback.model")
const appointmentModel = require("../../model/appointment.model")

/**
 * Fetches all services along with their therapists and calculates average ratings for each therapist.
 * Responds with an array containing therapist data along with service information.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.index = async(req, res, next)=>{
    try {
        // Fetch all services
        const services = await serviceModel.find({}).populate('therapist');
    
        // Create an array to store the final data
        let therapistsData = [];
    
        // Process each service
        for (let service of services) {
          const therapist = service.therapist;
    
          // Find all appointments for the therapist
          const appointments = await appointmentModel.find({ therapist: therapist._id });
    
          // Find all feedbacks for those appointments
          const feedbacks = await Promise.all(appointments.map(appointment =>
            appointmentFeedbackModel.findOne({ appointment: appointment._id })
          ));
    
          // Calculate average rating
          const totalRating = feedbacks.reduce((acc, feedback) => acc + (feedback ? feedback.rating : 0), 0);
          const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
    
          // Add the therapist data with this service to the array
          therapistsData.push({
            _id: therapist._id,
            name: therapist.fname + ' ' + therapist.lname,
            yearsOfExp: therapist.yearsOfExp,
            ratings: averageRating.toFixed(2), // Rounds to 2 decimal places
            location: service.location,
            fee: service.fee,
            service_id: service._id
          });
        }
    
        const therapistsDataa = [
          {
            _id: '1',
            name: 'John Doe',
            yearsOfExp: 5,
            ratings: '4.75',
            location: 'Location1',
            fee: 50,
            service_id: 1,
          },
          {
            _id: '1',
            name: 'John Doe',
            yearsOfExp: 5,
            ratings: '4.75',
            location: 'Location2',
            fee: 60,
            service_id: 2,
          },
          {
            _id: '1',
            name: 'John Doe',
            yearsOfExp: 5,
            ratings: '4.75',
            location: 'Location3',
            fee: 70,
            service_id: 3,
          },
          {
            _id: '2',
            name: 'Jane Smith',
            yearsOfExp: 8,
            ratings: '4.90',
            location: 'Location4',
            fee: 55,
            service_id: 1,
          },
          {
            _id: '2',
            name: 'Jane Smith',
            yearsOfExp: 8,
            ratings: '4.90',
            location: 'Location5',
            fee: 65,
            service_id: 2,
          },
          {
            _id: '2',
            name: 'Jane Smith',
            yearsOfExp: 8,
            ratings: '4.90',
            location: 'Location6',
            fee: 75,
            service_id: 3,
          },
          {
            _id: '3',
            name: 'Robert Johnson',
            yearsOfExp: 6,
            ratings: '4.60',
            location: 'Location7',
            fee: 58,
            service_id: 1,
          },
          {
            _id: '3',
            name: 'Robert Johnson',
            yearsOfExp: 6,
            ratings: '4.60',
            location: 'Location8',
            fee: 68,
            service_id: 2,
          },
          {
            _id: '3',
            name: 'Robert Johnson',
            yearsOfExp: 6,
            ratings: '4.60',
            location: 'Location9',
            fee: 78,
            service_id: 3,
          },
          {
            _id: '4',
            name: 'Emily Davis',
            yearsOfExp: 7,
            ratings: '4.80',
            location: 'Location10',
            fee: 62,
            service_id: 1,
          },
        ];
        
        res.status(200).json(therapistsDataa);
      } catch (error) {
        res.status(500).json({ error: 'Data not available' });
      }
}

/**
 * Fetches a therapist's details based on their ID and the ID of the service they provide.
 * Responds with the therapist's details and the service information.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.getTherapist = async(req, res, next)=>{
    const therapistId = req.params.therapistId;
    const serviceId = req.params.serviceId;
    try {
      const service = await serviceModel.findById(serviceId).populate('therapist');
    if (!service) {
      return res.status(404).send('Service not found');
    }
      
      res.status(200).json({
        success: true,
        service,
      })
    } catch (error) {
         next(error)
    }
}

/**
 * Registers a new therapist with provided details.
 *
 * @param {object} req - The HTTP request object containing therapist details.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.registerTherapist =  async (req, res) => {
  try {
    const { fname, lname, email, password, age, certification, yearsOfExp } = req.body;

    const existingUser = await therapistModel.findOne( {email});

    if (existingUser) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "The user Already Exists",
      });
    }

    const newTherapist = new therapistModel({
      fname,
      lname,
      email,
      password,
      age,
      certification,
      yearsOfExp,
    });

    const savedTherapist = await newTherapist.save();

    res.status(201).json({ message: 'Therapist registered successfully',  success: true, therapistId: savedTherapist._id });
  
  } catch (error) {
    next(error);
  }
};

/**
 * Logs in a therapist and updates their access token.
 *
 * @param {object} req - The HTTP request object containing therapist credentials.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.login = async(req, res, next) => {
  try {
    if (!req.user) {
      res.status(500).json({ message: "Login failed", status: 500 });
    } else {
      const existingUser = await therapistModel.findOne({ email: req.user.user.email });
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
 * Creates a new service for a therapist.
 *
 * @param {object} req - The HTTP request object containing service details.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.services = async(req, res, next)=>{
    try {
      const {therapistId} = req.query;
      const serviceData = req.body;
      if (!therapistId) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Therapist Id is required",
        });
      }
      const service = new serviceModel({
          therapist: therapistId,
          fee: serviceData.fee,
          name: serviceData.name,
          zoom: serviceData.zoom,
          location: serviceData.location,
          description: serviceData.description,
          enabled: serviceData.status,
      });

      const createdService = await service.save();

      res.status(201).json({
          success: true,
          message: 'Service created successfully',
          service: createdService
      });
} catch (error) {
  next(error)
}
}


/**
 * Get services of a therapist.
 *
 * @param {object} req - The HTTP request object containing service details.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.serviceHistory = async (req, res, next) => {
  try {
      const  therapistId  = req.params.therapistId;

      if (!therapistId) {
          return res.status(400).json({
              status: 400,
              success: false,
              message: "Therapist Id is required",
          });
      }

      // Query the database to find all services associated with the therapistId
      const services = await serviceModel.find({ therapist: therapistId });
      if (!services) {
          return res.status(404).json({
              success: false,
              message: 'Services not found',
          });
      }

      res.status(200).json({
          success: true,
          message: 'Services fetched successfully',
          services: services
      });
  } catch (error) {
      next(error);
  }
}


exports.deleteService = async (req, res, next) => {
  try {
      const { serviceId } = req.params; 

      // Check if serviceId is provided
      if (!serviceId) {
          return res.status(400).json({
              status: 400,
              success: false,
              message: "Service Id is required",
          });
      }

      // Find the service by its id and delete it
      const deletedService = await serviceModel.findByIdAndDelete(serviceId);

      // If no service is found with the given id
      if (!deletedService) {
          return res.status(404).json({
              status: 404,
              success: false,
              message: "Service not found",
          });
      }

      res.status(200).json({
          success: true,
          message: 'Service deleted successfully',
          deletedService: deletedService
      });
  } catch (error) {
      next(error);
  }
}

exports.getServiceById = async (req, res, next) => {
  try {
      const { serviceId } = req.params; // Assuming serviceId is provided in the URL parameters

      // Check if serviceId is provided
      if (!serviceId) {
          return res.status(400).json({
              status: 400,
              success: false,
              message: "Service Id is required",
          });
      }

      // Find the service by its id
      const service = await serviceModel.findById(serviceId);

      // If no service is found with the given id
      if (!service) {
          return res.status(404).json({
              status: 404,
              success: false,
              message: "Service not found",
          });
      }

      res.status(200).json({
          success: true,
          message: 'Service retrieved successfully',
          service: service
      });
  } catch (error) {
      next(error);
  }
}

exports.updateServiceById = async (req, res, next) => {
  try {
      const { serviceId } = req.params; 
      const updatedServiceData = req.body; 

      if (!serviceId) {
          return res.status(400).json({
              status: 400,
              success: false,
              message: "Service Id is required",
          });
      }

      const updatedService = await serviceModel.findByIdAndUpdate(serviceId, updatedServiceData, { new: true });


      if (!updatedService) {
          return res.status(404).json({
              status: 404,
              success: false,
              message: "Service not found",
          });
      }

      res.status(200).json({
          success: true,
          message: 'Service updated successfully',
          service: updatedService
      });
  } catch (error) {
      next(error);
  }
}
/**
 * Fetches all therapists along with their associated services and calculates average ratings for each therapist.
 * Responds with an array containing therapist data along with service information.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.get = async (req, res, next) => {
  try {
    const services = await serviceModel.find({enabled: true}).populate({
      path: 'therapist',
      select: '_id fname lname profileImage email age certification yearsOfExp',
    });

const newTherapistArray = [];
    const therapistMap = new Map(); 

    for (let service of services) {
      const therapist = service.therapist;

      if (!therapistMap.has(therapist._id)) {
        const appointments = await appointmentModel.find({ therapist: therapist._id });
        const feedbacks = await Promise.all(appointments?.map(appointment =>
          appointmentFeedbackModel.findOne({ appointment: appointment._id })
        ));

        const totalRating = feedbacks.reduce((acc, feedback) => acc + (feedback?.rating || 0), 0);
        const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;

        therapistMap.set(therapist._id, totalRating.toFixed(2)); 
      }

      const newTherapist = {
        _id: therapist._id,
        fname: therapist.fname,
        lname: therapist.lname,
        profileImage: therapist?.profileImage,
        yearsOfExp: therapist.yearsOfExp,
        ratings: therapistMap.get(therapist._id), 
        location: service?.location,
        fee: service?.fee,
        zoom: service?.zoom,
        service_id: service?._id,
      };

      newTherapist.ratings = newTherapist.ratings ? parseFloat(newTherapist.ratings) : 0;

      newTherapistArray.push(newTherapist); 
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Therapists fetched successfully",
      therapists: newTherapistArray, 
    });
  } catch (error) {
    next(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Updates the password of a therapist.
 *
 * @param {object} req - The HTTP request object containing therapist ID and new password.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
  exports.editPassword = async (req, res, next) => {
    try {
      let payload = req.body;
      let user = await therapistModel.findOne({ _id: new ObjectId(payload?._id) });
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
 * Fetches all therapists along with their associated services.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
  exports.getAllTherapist = async (req, res, next) => {
    try {
        const newTherapist = await serviceModel.find().populate({
          path: 'therapist',
        }).sort({ createdAt: -1 });
  
  
          res.status(200).json({
            status: 200,
            success: true,
            message: "Therapist fetched Successfully",
            newTherapist,
          });
    } catch (error) {
        next(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };