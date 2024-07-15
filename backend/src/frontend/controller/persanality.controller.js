const userModel = require("../../model/user.model");
const personalityModel = require("../../model/personality.model");

/**
 * Converts user answers to integers based on a predefined mapping.
 *
 * @param {Array} answers - User answers to be converted.
 * @returns {Array} - Converted answers as integers.
 */
function convertAnswersToIntegers(answers) {
    const mapping = {
      'strongly disagree': 1,
      'disagree': 2,
      'neutral': 3,
      'agree': 4,
      'strongly agree': 5
    };
  
    return answers?.map(answer => mapping[answer.toLowerCase()] || 0);
}

  
  /**
 * Calculates OCEAN scores based on user answers.
 *
 * @param {Array} answers - User answers for OCEAN questions.
 * @returns {Object} - Calculated OCEAN scores.
 */
  function calculateOceanScores(answers) {
    const itemsToReverse = new Set([6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20]);

    const modifiedAnswers = answers.slice();

    for (let i = 0; i < modifiedAnswers.length; i++) {
        if (i + 1 in itemsToReverse) {
            modifiedAnswers[i] = 6 - modifiedAnswers[i];
        }
    }

    // Calculating OCEAN scores as percentages
    const totalQuestions = 20;
    const openness = (([5, 10, 15, 20].reduce((sum, i) => sum + modifiedAnswers[i - 1], 0) / (totalQuestions * 5)) * 100).toFixed(2);
    const conscientiousness = (([3, 8, 13, 18].reduce((sum, i) => sum + modifiedAnswers[i - 1], 0) / (totalQuestions * 5)) * 100).toFixed(2);
    const extraversion = (([1, 6, 11, 16].reduce((sum, i) => sum + modifiedAnswers[i - 1], 0) / (totalQuestions * 5)) * 100).toFixed(2);
    const agreeableness = (([2, 7, 12, 17].reduce((sum, i) => sum + modifiedAnswers[i - 1], 0) / (totalQuestions * 5)) * 100).toFixed(2);
    const neuroticism = (([4, 9, 14, 19].reduce((sum, i) => sum + modifiedAnswers[i - 1], 0) / (totalQuestions * 5)) * 100).toFixed(2);

    return {
        Openness: openness,
        Conscientiousness: conscientiousness,
        Extraversion: extraversion,
        Agreeableness: agreeableness,
        Neuroticism: neuroticism,
    };
}


/**
 * Handles the personality assessment of a user based on their answers to OCEAN questions.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.personality = async(req, res, next)=>{
    const userId = req.params.id;
    const userAnswers = req.body.userAnswers;
    const convertedAnswers = convertAnswersToIntegers(userAnswers);
    const oceanScores = calculateOceanScores(convertedAnswers);

    let userPersonalityType = '';
    if (oceanScores?.Extraversion <= 10) {
        userPersonalityType = 'introvert';
    } else if (oceanScores?.Extraversion <= 13) {
        userPersonalityType = 'ambivert';
    } else if (oceanScores?.Extraversion <= 20) {
        userPersonalityType = 'extrovert';
    }
    try {
        personality = await personalityModel.create({
                personalityType: userPersonalityType,
                oceanScores: oceanScores
        });

        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            personality: personality._id
        }, { new: true }); 

        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }

        const oceanScoresPercentage = {
            Openness: oceanScores?.Openness,
            Conscientiousness: oceanScores.Conscientiousness,
            Extraversion: oceanScores.Extraversion,
            Agreeableness: oceanScores.Agreeableness,
            Neuroticism: oceanScores.Neuroticism
        };

        res.status(200).json({
            success: true,
            userPersonality: userPersonalityType,
            oceanScores: oceanScoresPercentage
        });
    } catch (error) {
       next(error)
    }
}