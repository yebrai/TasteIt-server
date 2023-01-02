const router = require("express").Router();
const User = require("../models/User.model");
const uploader = require("../middlewares/cloudinary.js");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../middlewares/auth.middlewares");

// GET "/api/user" => render all users
router.get("/", async (req, res, next) => {
  try {
    const response = await User.find();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET "/api/user/details" => render user
router.get("/details", isAuthenticated, async (req, res, next) => {
  try {
    const response = await User.findById(req.payload._id);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/user/:userId/details" => edit user
router.patch(
  "/:userId/details",
  uploader.single("image"),
  async (req, res, next) => {
    const { userId } = req.params;
    const { name, email, age, password } = req.body;

    // Validation 1. Fields must not be empty
    if (!name || !age || !email || !password) {
      res
      .status(400)
      .json({ errorMessage: "Todos los campos deben ser rellenados" });
      return;
    }

    // Validation 2. Name should at least contain 3 characters
    if (name.length < 3) {
      res
        .status(400)
        .json({
          errorMessage: "El nombre de usuario debe tener al menos 3 carácteres",
        });
      return;
    }
    
    // Validation 3. Age value between 18 - 120
    if (age < 18) {
      res.status(400).json({ errorMessage: "Debes tener al menos 18 años" });
      return;
    }
    
    // Validation 4. Email format validation
    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (!emailRegex.test(email)) {
      res
        .status(400)
        .json({ errorMessage: "Formato de correo electrónico incorrecto" });
      return;
    }

    // Validation 5. Age must be a number
    if (isNaN(Number(age))) {
      res.status(400).json({ errorMessage: "La edad debe ser un número" });
      return;
    }
    
    // Validation 6. Password format validation
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (!passwordRegex.test(password)) {
      res
        .status(400)
        .json({
          errorMessage:
            "La contraseña debe tener al menos 8 letras, una mayúscula y un número",
        });
      return;
    }


    try {
      // Validation 7: Email doesn't already exists in the DB
      const foundEmail = await User.findOne({ email });
      if (foundEmail !== null) {
        res
          .status(400)
          .json({ errorMessage: "El email ya ha sido previamente registrado" });
        return;
      }

      // Password Encrypting
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const editUser = {
        name,
        email,
        age,
        password: hashPassword,
        profileImage: req.file?.path,
      };

      const response = await User.findByIdAndUpdate(userId, editUser);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE "/api/user/:userId" => delete user
router.delete("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);

    res.status(200).json("Deleted document");
  } catch (error) {
    next(error);
  }
});

//Path "/api/cart/add"
router.patch("/cart/add", isAuthenticated, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.payload._id, {
      $push: { shoppingCart: req.body },
    });
    res.status(200).json("Added product");
  } catch (error) {
    next(error);
  }
});

//GET "/api/user/cart"
router.get("/cart", isAuthenticated, async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.payload._id).populate(
      "shoppingCart"
    );
    res.status(200).json(foundUser.shoppingCart);
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/user/cart/:productId/delete" => delete product
router.delete(
  "/cart/:productId/delete",
  isAuthenticated,
  async (req, res, next) => {
    const { productId } = req.params;
    try {
      await User.findByIdAndUpdate(req.payload._id, {
        $pull: { shoppingCart: productId },
      });
      res.status(200).json("Product was deleted");
    } catch (error) {
      next(error);
    }
  }
);

// DELETE "/api/user/cart/delete" => delete the entire cart of the current user after the purchase is done
router.delete("/cart/delete", isAuthenticated, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.payload._id, {
      $set: { shoppingCart: [] },
    });
    res.status(200).json("Product was deleted");
  } catch (error) {
    next(error);
  }
});

// GET "/api/user/favourites" => gets all the favourite products for current online user
router.get("/favourites", isAuthenticated, async (req, res, next) => {
  try {
    const favouritesArr = await User.findById(req.payload._id).select(
      "favourites"
    );
    res.status(200).json(favouritesArr);
  } catch (error) {
    next(error);
  }
});

// GET "/api/user/favourites" => gets all the favourite products for current online user
router.get("/my-favourites", isAuthenticated, async (req, res, next) => {
  try {
    const favouritesArr = await User.findById(req.payload._id)
      .select("favourites")
      .populate("favourites");
    res.status(200).json(favouritesArr);
  } catch (error) {
    next(error);
  }
});

// POST "/api/user/:favouriteId" => to add a new favourite product in the user
router.post("/favourite/add", isAuthenticated, async (req, res, next) => {
  try {
    const favouritesArr = await User.findByIdAndUpdate(req.payload._id, {
      $addToSet: { favourites: req.body },
    });
    res.status(200).json(favouritesArr);
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/user/:favouriteId" => to delete a favourite product from user favourites list
router.delete(
  "/:favouriteId/delete",
  isAuthenticated,
  async (req, res, next) => {
    const { favouriteId } = req.params;

    try {
      await User.findByIdAndUpdate(req.payload._id, {
        $pull: { favourites: favouriteId },
      });
      res.status(200).json("Favourite was deleted");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
