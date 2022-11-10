const router = require("express").Router();
const Product =require("../models/Product.model.js")


// GET "/api/product" => render all products
router.get("/", async (req, res, next) => {

    try {
        const response = await Product.find()
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }

})


// POST "/api/product/add" => register a new product (receives user name, email and password from FE)
router.post("/add", async (req, res, next) => {

  try {
    await Product.create(req.body)
    res.status(201).json("Producto creado")

  } catch (error) {
    next(error)
  }

})

// GET "/api/product/:productId/details" => render product (receives user name, email and password from FE)
router.get("/:productId/details", async (req, res, next) => {
    const {productId} = req.params
    try {

      const response = await Product.findById(productId)
      res.status(201).json(response)
  
    } catch (error) {
      next(error)
    }
  })

  // PATCH "/api/product/:productId/details" => edit product (receives user name, email and password from FE)
router.patch("/:productId/details", async (req, res, next) => {
    const {productId} = req.params
    try {

      const response = await Product.findByIdAndUpdate(productId, req.body)
      res.status(201).json(response)
  
    } catch (error) {
      next(error)
    }
  })




module.exports = router;