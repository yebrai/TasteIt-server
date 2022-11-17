const router = require("express").Router();
const Product = require("../models/Product.model.js");
const isAuthenticated = require("../middlewares/auth.middlewares");
const uploader = require("../middlewares/cloudinary.js");

// GET "/api/products" => gets all products from DB
router.get("/", async (req, res, next) => {

  try {
    const response = await Product.find();
    res.status(200).json(response);

  } catch (error) {
    next(error);
  }
});

// GET "/api/product" => renders all products depending on the passed type
router.get("/:type", async (req, res, next) => {
  // Stores the chosen product list
  let response = "";

  try {
    if (req.params.type === "all") {
      response = await Product.find().populate("owner", "_id");
    } else {
      response = await Product.find({ category: req.params.type }).populate(
        "owner",
        "_id"
      );
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST "/api/product/add" => register a new product (receives user name, email and password from FE)
router.post(
  "/add",
  isAuthenticated,
  uploader.single("image"),
  async (req, res, next) => {
    const { name, category, price, location, description } = req.body;

    // Validation 1: all the fields must be completed
    if (!name || !category || !price || !location || !description) {
      res.status(400).json({ errorMessage: "Todos los campos deben ser rellenados" });
      return;
    }

    // Validation 2. Price must be a number
  if (isNaN(Number(price))) {
    res.status(400).json({ errorMessage: "El precio debe ser un número" });
    return;
  }  

    const newProduct = {
      name,
      category,
      price,
      location,
      image: req.file?.path,
      description,
      owner: req.payload._id,
    };
    try {
      await Product.create(newProduct);
      res.status(201).json("creado");
    } catch (error) {
      next(error);
    }
  }
);

// GET "/api/product/:productId/details" => render product (receives user name, email and password from FE)
router.get("/:productId/details", async (req, res, next) => {
  const { productId } = req.params;

  try {
    const response = await Product.findById(productId).populate(
      "owner",
      "name"
    );
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/product/:productId/details" => edit product
router.patch(
  "/:productId/details",
  isAuthenticated,
  uploader.single("image"),
  async (req, res, next) => {
    const { productId } = req.params;
    const { name, description, category, price, location } = req.body;

    // Validation 1. Fields must not be empty
    if (!name || !description || !category || !price || !location) {
      res
        .status(400)
        .json({ errorMessage: "Todos los campos deben ser rellenados" });
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

      const response = await Product.findByIdAndUpdate(productId, editProduct);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE "/api/product/:productId" => delete product
router.delete("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  try {
    await Product.findByIdAndDelete(productId);

    res.status(200).json("Producto borrado");
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/product/:productId/rate" => changes (or adds if it is the first time user rates the product) a product rating
router.patch("/:productId/rate", isAuthenticated, async (req, res, next) => {
  const { productId } = req.params
  
  const rating = Number(Object.keys(req.body)[0])

  try {

    const productToRate = await Product.findById(productId)
    console.log(productToRate)

    if (productToRate.whoRates.includes(req.payload._id)) {
      res.status(200).json("Valoración previamente añadida")

    } else {
      await Product.findByIdAndUpdate(productId, {$addToSet: { whoRates: req.payload._id}}, {new: true})
      await Product.findByIdAndUpdate(productId, {$addToSet: { ratings: rating}}, {new: true});

      res.status(200).json("Valoración añadida")
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;
