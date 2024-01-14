
// This is your test secret API key.
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
const calculateOrderAmount = (totalAmount) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return Math.round(totalAmount * 100);
};
export const stripeIntent = async (req, res) => {
    const { totalAmount, userData } = req.body;

    try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(totalAmount),
            currency: "usd",
            shipping: {
                name: `${userData.first_name + ' ' + userData.last_name}`,
                address: {
                    line1: `${userData.address + ' ' + userData.apartment}`,
                    postal_code: `${userData.postcode}`,
                    city: `${userData.city}`,
                    country: `${userData.country}`,
                },
            },
            automatic_payment_methods: {
                enabled: true,
            },
            description: 'Purchasing Cards services',
        })
        res.send({
            id: paymentIntent.id,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }
}

export const cancelStripeIntent = async (req, res) => {
    const { id } = req.body;
    try {
        const cancelledPaymentIntent = await stripe.paymentIntents.cancel(id)
        res.send({status: true, message: "Payment Intent was successfully canceled."});
    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }
}