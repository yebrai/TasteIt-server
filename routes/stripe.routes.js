const router = require("express").Router();
const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE)

// POST /api/stripe 
router.post("/", (req, res, next) => {

})

module.exports = router;