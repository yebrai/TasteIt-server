const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");
const Comment = require("../models/Comment.model")

// GET "/api/comment/:productId" => render all comments of a product
router.get("/:productId", async (req, res, next) => {

    const { productId } = req.params;

    try {
        const response = await Comment.find({product: productId}).populate("user", "name profileImage")
        res.status(200).json(response)

    } catch (error) {
        next(error)
    }

})

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

// DELETE "/api/comment/:commentId" => delete comment from a productId
router.delete("/:commentId", async (req, res, next) => {
  const { commentId } = req.params;

  try {
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json("Comentario borrado");

  } catch (error) {
    next(error);
  }
});

module.exports = router;
