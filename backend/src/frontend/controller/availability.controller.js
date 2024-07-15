
/**
 * Availability Controller
 *
 * This controller handles operations related to therapist availability, including
 * adding, fetching, updating, and deleting availability slots.
 *
 * @module controllers/availability.controller
 */

const Availability = require("../../model/availability.model");

// Helper function to sort availability list
const sortAvailabilityList = (availabilityList) => {
  const sortedAvailabilityList = availabilityList?.map((availability) => {
    const sortedSlots = availability.schedualSlots.sort((a, b) => {
      const [hourA, minuteA] = a.startTime.split(":").map(Number);
      const [hourB, minuteB] = b.startTime.split(":").map(Number);
      const timeA = hourA * 60 + minuteA;
      const timeB = hourB * 60 + minuteB;

      if (timeA < timeB) {
        return -1;
      } else if (timeA > timeB) {
        return 1;
      } else {
        return 0;
      }
    });
    return { day: availability.day, schedualSlots: sortedSlots };
  });
  return sortedAvailabilityList;
};

// Helper function to calculate slot duration in minutes
function getSlotDuration(startTime, endTime) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
  return duration;
}

// Function to check if two time slots overlap
function isSlotOverlap(
  slot1StartTime,
  slot1EndTime,
  slot2StartTime,
  slot2EndTime
) {
  const [hour1, minute1] = slot1StartTime.split(":").map(Number);
  const [hour2, minute2] = slot2StartTime.split(":").map(Number);

  const time1 = hour1 * 60 + minute1;
  const time2 = hour2 * 60 + minute2;

  return (
    (time1 >= time2 &&
      time1 < time2 + getSlotDuration(slot2StartTime, slot2EndTime)) ||
    (time2 >= time1 &&
      time2 < time1 + getSlotDuration(slot1StartTime, slot1EndTime))
  );
}

/**
 * Add availability slot for a therapist.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.addAvailability = async (req, res, next) => {
  try {
    const { day, startTime, endTime, therapistId} = req.body;

    if (!startTime || !endTime || !day || !therapistId) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }
    const [hourA, minuteA] = startTime.split(":").map(Number);
    const [hourB, minuteB] = endTime.split(":").map(Number);
    const timeA = hourA * 60 + minuteA;
    const timeB = hourB * 60 + minuteB;

    if (timeB - timeA < 20) {
      return res.status(400).json({
        success: false,
        message: "Minimum slot time is 20 minutes",
      });
    }

    if (timeA >= timeB) {
      return res.status(400).json({
        success: false,
        message: "The start time must be before the end time",
      });
    }
    const existingAvailability = await Availability.findOne({ day, therapistId });
    if (existingAvailability) {
      const slotExists = existingAvailability.schedualSlots.some((slot) =>
        isSlotOverlap(slot.startTime, slot.endTime, startTime, endTime)
      );
      if (slotExists) {
        return res.status(400).json({
          success: false,
          message: "The slot already exists for that specific day",
        });
      }
    }
    const newSlot = {
      startTime,
      endTime,
    };

    if (existingAvailability) {
      existingAvailability.schedualSlots.push(newSlot);
      await existingAvailability.save();
    } else {
      var newavailability = new Availability({
        therapistId,
        day,
        schedualSlots: [newSlot],
      });
      await newavailability.save();
    }
    const availabilityList = await Availability.find();
    const availability = sortAvailabilityList(availabilityList);
    res.status(201).json({
      success: true,
      data: availability,
      message: "Availability slot added successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve availability slots for a therapist.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.getAvailability = async (req, res, next) => {
  try {
    const {therapistId} = req.query;
    const availabilityList = await Availability.find({therapistId});
    const sortedAvailabilityList = sortAvailabilityList(availabilityList);
    if (sortedAvailabilityList.length) {
      res.status(200).json({
        success: true,
        data: sortedAvailabilityList,
        message: "Availability fetched successfully",
      });
    } else {
      const availability = [
        {
          Monday: [{ startTime: "", endTime: "" }],
          Tuesday: [{ startTime: "", endTime: "" }],
          Wednesday: [{ startTime: "", endTime: "" }],
          Thursday: [{ startTime: "", endTime: "" }],
          Friday: [{ startTime: "", endTime: "" }],
          Saturday: [{ startTime: "", endTime: "" }],
          Sunday: [{ startTime: "", endTime: "" }],
        },
      ];
      res.status(200).json({
        success: true,
        message: "Availability not available",
        data: availability,
      });
    }
  } catch (error) {
    next(error);
  }
};


/**
 * Update availability slot for a therapist.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.updateAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime, status } = req.body;
    if (!day || !startTime || !endTime || !status) {
      return res
        .status(400)
        .json({ success: false, message: "The order data is invalid" });
    }
    const updatedAvailability = await Availability.findByIdAndUpdate(
      id,
      { day, startTime, endTime, status },
      { new: true }
    );

    if (!updatedAvailability) {
      return res
        .status(404)
        .json({ success: false, message: "Availability not available" });
    }
    return res.status(200).json({
      updatedAvailability,
      success: true,
      message: "Availability updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete availability slot for a therapist.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.deleteAvailability = async (req, res, next) => {
  try {
    const { day, slotId } = req.query;
    const availability = await Availability.findOne({ day });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: `Slots for ${day} does not exists`,
      });
    }

    // Finding the index of the slot within the scheduledSlots array
    const slotIndex = availability.schedualSlots.findIndex(
      (slot) => slot._id.toString() === slotId
    );

    if (slotIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "The slot does not exist",
      });
    }

    // Remove the slot from the scheduledSlots array
    availability.schedualSlots.splice(slotIndex, 1);

    await availability.save();
    const availabilityList = await Availability.find();
    const allAvailability = sortAvailabilityList(availabilityList);
    res.status(200).json({
      success: true,
      message: "The slot has been successfully deleted",
      allAvailability: allAvailability,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve availability slots for a specific day.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.getDayAvailability = async (req, res, next) => {
  try {
    const { day } = req.body;
    const availability = await Availability.findOne({ day });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: `No slots for ${day} exists`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Slot for ${day} fetched successfully`,
      dayAvailability: availability.schedualSlots,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve therapist availability slots for a specific day.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.getTherapistAvailability = async (req, res, next) => {
  try {
    const {day, date, therapistId} = req.query;

    const availability = await Availability.findOne({ day, therapistId });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: `No slots for ${day} exists`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Slot for ${day} fetched successfully`,
      dayAvailability: availability.schedualSlots,
    });
  } catch (error) {
    next(error);
  }
};