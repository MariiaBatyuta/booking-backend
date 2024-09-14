import Stripe from "stripe";
import User from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const saveUserPayment = async (req, res, next) => {
    const { paymentMethodId } = req.body;
    if (!paymentMethodId) return res.status(404).send({ message: "Payment method didn't fount!" });
    
    try {
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        if (!paymentMethod) return res.status(404).send({ message: "Payment method didn't found!" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: "Not authorized!" });

        user.payment = {
            lastFourDigits: paymentMethod.card.last4,
            cardType: paymentMethod.card.brand,
            cardExpiry: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`,
            cardholderName: paymentMethod.billing_details.name
        };
        await user.save();

        res.status(200).send(user.payment);
    } catch (error) {
        next(error);
    }
}