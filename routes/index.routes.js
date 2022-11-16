const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const productRoutes = require("./product.routes")
router.use("/product", productRoutes)

const userRoutes = require("./user.routes")
router.use("/user", userRoutes)

const commentRoutes = require("./comment.routes")
router.use("/comment", commentRoutes)

const purchaseRoutes = require("./purchase.routes")
router.use("/purchase", purchaseRoutes)

const stripeRoutes = require("./stripe.routes")
router.use("/stripe", stripeRoutes)

module.exports = router;