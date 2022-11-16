const router = require("express").Router();
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE)

// POST /api/stripe 
router.post("/", async (req, res, next) => {
    const {id, amount} = req.body

    const newPayment = {
        amount,
        currency: "EUR",
        description: "Pedido",
        payment_method: id,
        confirm: true  // confirms the payment in Stripe
    }

    try {
        const payment = await stripe.paymentIntents.create(newPayment)

        res.status(200).json("Compra registrada")

    } catch (error) {
        res.json({ message: error.raw.message })
    }

})

module.exports = router;