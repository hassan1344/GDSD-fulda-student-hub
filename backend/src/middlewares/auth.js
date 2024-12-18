import { verifyToken } from "../utils/jwtUtils.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const user = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authenticateStudent = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;

    if (user.userType !== "STUDENT") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only students can access this route" });
    }

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authenticateLandlord = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  // console.log("Extracted Token:", token); // Log the extracted token

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = verifyToken(token, process.env.ACCESS_TOKEN_SECRET); // Verify the token
    req.user = user; // Attach user info to the request object

    // Debug: Print entire user object
    // console.log("Authenticated User:", req.user);

    // Check if the user type is LANDLORD
    if (user.userType !== "LANDLORD") {
      // Use userType instead of user_type
      return res
        .status(403)
        .json({ error: "Forbidden: Only landlord can access this route" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // console.error("Token verification error:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
};
export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.query ? socket.handshake.query.token : null;
  if (!token) {
  }
  if (!token) {
    return next(new Error("Unauthorized"));
  }
  try {
    const user = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    socket.decoded = user;
    next();
  } catch (error) {
    console.log(error);
    return next(new Error("Invalid token"));
  }
};
