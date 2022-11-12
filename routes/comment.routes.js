const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");
const Comment = require("../models/Comment.model")

// POST "/api/comment/:productId/add" => register a new comment
router.post("/:productId/add", isAuthenticated, async (req, res, next) => {
  
  const { productId } = req.params;
  const { message } = req.body;

  const newComment = {
    message,
    user: req.payload._id,
    product: productId
  }

  try {
    await Comment.create(newComment)
    res.status(201).json("creado")

  } catch(error) {
    next(error)
  }

});

module.exports = router;
