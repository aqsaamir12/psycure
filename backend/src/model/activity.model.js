const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        feedback_taken: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);

// Initialize static activities
const staticActivities = [
    { type: 'Incomplete chatbot conversation' },
    { type: 'Complete chatbot conversation' },
    { type: 'Booked appointment' },
    { type: 'Completed appointment' },
    { type: 'Cancelled appointment' },
];

// Function to initialize static activities in the database
async function initializeStaticActivities() {
    try {
        for (const activity of staticActivities) {
            await Activity.findOneAndUpdate(
                { type: activity.type },
                activity,
                { upsert: true, new: true }
            );
        }
    } catch (error) {
        console.error('Error initializing static activities:', error.message);
    }
}

// Call the function to initialize static activities
initializeStaticActivities();

module.exports = Activity;
