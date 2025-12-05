import jwt from "jsonwebtoken";

/**
 * ============================================================
 * AUTH MIDDLEWARE
 * Validates JWT token passed in "Authorization: Bearer <token>"
 *
 * Steps:
 *  1. Check if Authorization header exists
 *  2. Validate the format (should contain 2 parts → "Bearer token")
 *  3. Extract token and verify using JWT_SECRET
 *  4. Attach decoded user payload to req.user
 *  5. Call next() to continue request
 * ============================================================
 */
export default (req, res, next) => {
  const authHeader = req.header("Authorization");

  // No token provided at all
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  // Format must be: "Bearer <token>"
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid Authorization format" });
  }

  // Extract actual token
  const token = parts[1];

  try {
    // Verify JWT and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to the request
    req.user = decoded;

    // Move to next middleware / controller
    next();
  } catch (err) {
    // Token is expired or malformed
    return res.status(401).json({ message: "Invalid Token" });
  }
};
