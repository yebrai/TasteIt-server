const router = require("express").Router();
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE)

// POST /api/stripe register payment in stripe.
router.post("/", async (req, res, next) => {
    const {id, amount} = req.body

    const newPayment = {
        amount,
        currency: "EU",
        description: "Pedido",
        payment_method: id,
        confim: true
    }

    try {
        const payment = await stripe.paymentIntents.create(newPayment)
        console.log(payment);

        res.status(200).json("Compra registrada")
    } catch (error) {
        console.log(error)
        res.status(400).json("errorMessage:", error)
    }

})

module.exports = router;