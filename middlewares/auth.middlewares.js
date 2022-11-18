const { expressjwt: jwt } = require("express-jwt");

// Middleware to pass the token payload to the FE route
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload", // Returns payload when token has been validated

  getToken: (req) => {
    // Req.headers contains the token
    if (req.headers === undefined || req.headers.authorization === undefined) {
      return null;
    }

    // If token exists, extract it from the string and return it from the function
    const tokenArr = req.headers.authorization.split(" ");
    const tokenType = tokenArr[0];
    const token = tokenArr[1];

    if (tokenType !== "Bearer") {
      return null;
    }

    // Token has been received so return it from the function
    return token;
  },
});

module.exports = isAuthenticated;
