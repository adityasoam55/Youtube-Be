import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  // Expected: "Bearer token"
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid Authorization format" });
  }

  const token = parts[1]; // the actual token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user data for next middleware
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
