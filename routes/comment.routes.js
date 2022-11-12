const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");

// POST "/api/comment/add" => register a new product (receives user name, email and password from FE)
router.post("/add", isAuthenticated, async (req, res, next) => {
  const { message } = req.body;
});

module.exports = router;
