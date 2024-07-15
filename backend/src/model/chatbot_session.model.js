const mongoose = require('mongoose');

const chatbotSessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        start_time: { type: Date, required: true },
        end_time: { type: Date },
        log: [{ type: String  }],
    }
);

module.exports = mongoose.model('ChatbotSession', chatbotSessionSchema);
