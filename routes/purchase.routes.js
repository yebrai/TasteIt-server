const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares.js");
const Purchase = require("../models/Purchase.model.js");

// POST "/api/purchase/add" register a new purchase(recieves user._id from payload and arr with products_id from FE)
router.post("/add", isAuthenticated, async (req, res, next) => {
  const newPurchase = {
    buyer: req.payload._id,
    items: req.body,
  };
  try {
    await Purchase.create(newPurchase);
    res.status(201).json("Compra realizada");
  } catch (error) {
    next(error);
  }
});

// GET "/api/purchase"
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const response = await Purchase.find({ buyer: req.payload._id }).populate(
      "items"
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
