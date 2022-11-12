const router = require("express").Router();
const Product =require("../models/Product.model.js")
const isAuthenticated =require("../middlewares/auth.middlewares")
const uploader = require("../middlewares/cloudinary.js");


// GET "/api/product" => render all products
router.get("/:type", async (req, res, next) => {

    // Stores the chosen product list
    let response = "";

    try {
        if (req.params.type === "all") {
          response = await Product.find().populate("owner", "_id")
        } else {
          response = await Product.find({category: req.params.type}).populate("owner", "_id")
        }
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }

})


// POST "/api/product/add" => register a new product (receives user name, email and password from FE)
router.post("/add", isAuthenticated,  uploader.single("image"), async (req, res, next) => {

  const {name, category, price, location, description} = req.body

  const newProduct = {
    name,
    category,
    price,
    location,
    image: req.file?.path,
    description,
    owner: req.payload._id
  }
  try {
    
    await Product.create(newProduct)
    res.status(201).json("creado")

  } catch (error) {
    next(error)
  }

})

// GET "/api/product/:productId/details" => render product (receives user name, email and password from FE)
router.get("/:productId/details", async (req, res, next) => {
    const {productId} = req.params

    try {
      const response = await Product.findById(productId).populate("owner", "name")
      res.status(201).json(response)
  
    } catch (error) {
      next(error)
    }
  })

  // PATCH "/api/product/:productId/details" => edit product
router.patch("/:productId/details", isAuthenticated, uploader.single("image"), async (req, res, next) => {
    const { productId } = req.params
    const { name, description, category, price, location} = req.body;
    
    // Validation 1. Fields must not be empty
    if (!name || !description || !category || !price || !location) {
      res.status(400).json({ errorMessage: "Todos los campos deben ser rellenados" });
      return;
    }

    try {

      const editProduct = {
        name,
        description,
        category,
        price,
        location,
        image: req.file?.path,
      };
  
      const response = await Product.findByIdAndUpdate(productId, editProduct)
      res.status(200).json(response)
  
    } catch (error) {
      next(error)
    }
  })

  // DELETE "/api/product/:productId" => delete product
  router.delete("/:productId", async (req, res, next) => {
    const {productId} = req.params
    try {
  
      await Product.findByIdAndDelete(productId)
  
      res.status(200).json("Producto borrado")
  
    } catch (error) {
      next(error)
    }

  })





module.exports = router;