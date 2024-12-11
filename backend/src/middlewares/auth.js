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
}

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
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;

    if (user.user_type !== "LANDLORD") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only landlord can access this route" });
    }

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
