const mongoose = require('mongoose');

const personalitySchema = new mongoose.Schema({
    personalityType: { type: String, required: true },
    oceanScores: {
        Openness: { type: Number, default: 0 },
        Conscientiousness: { type: Number, default: 0 },
        Extraversion: { type: Number, default: 0 },
        Agreeableness: { type: Number, default: 0 },
        Neuroticism: { type: Number, default: 0 }
    }
});

const Personality = mongoose.model('Personality', personalitySchema);

module.exports = Personality;
