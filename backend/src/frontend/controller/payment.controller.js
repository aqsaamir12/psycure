const { ObjectId } = require("mongoose").Types;
const paymentModel = require("../../model/payment.model");
const stripe = require("stripe")('sk_test_51OvR7XP40BAZPmSYCTwOdl483BRY9EhYI82TfGrg6RhfHw5mHUTDCvZkYQ4yG2IiAq0BpSG8OGB8QTRfYOnYb6sx008eaY95FA');


/**
 * Handles the listing of payments and payment intents, and updates the payment status based on the Stripe payment intent status.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
exports.list = async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'Please provide either userId or therapistId' });
        }

        const paymentIntents = await stripe.paymentIntents.list();

        const payments = await paymentModel.aggregate([
            {
                $match: {
                    $or: [
                        { user: new ObjectId(userId) },
                        { therapist: new ObjectId(userId) }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'therapists', 
                    localField: 'therapist',
                    foreignField: '_id',
                    as: 'therapist'
                }
            },
            {
                $unwind: '$user' 
            },
            {
                $unwind: '$therapist' 
            },
            {
                $project: {
                    _id: 1,
                    user: {
                        _id: '$user._id',
                        fname: '$user.fname', 
                        lname: '$user.lname', 
                    },
                    therapist: {
                        _id: '$therapist._id',
                        fname: '$therapist.fname', 
                        lname: '$therapist.lname', 
                    },
                    scheduled_date: 1,
                    fee: 1,
                    paymentIntentId: 1,
                    paid: 1,
                    scheduled_time: 1,
                    reason: 1
                }
            }
        ]);

    const stripePayments = await Promise.all(paymentIntents?.data?.map(async (intent) => {
        const paymentIntent = await stripe.paymentIntents.retrieve(intent.id);
        return {
            id: intent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
        };
    }));

    for (const payment of payments) {
        const stripePayment = stripePayments.find(p => p.id == payment.paymentIntentId);
        if (stripePayment && stripePayment?.status === 'succeeded') {
            await paymentModel.findByIdAndUpdate(payment._id, { paid: true });
            payment.paid = true;
        } 
    }
        res.json({ success: true, payments, stripePayments });
    } catch (error) {
        console.error(error);
        next(error);
    }
}
