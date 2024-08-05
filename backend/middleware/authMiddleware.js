import jwt from "jsonwebtoken";

const JWT_SECRET = 'iskandar';

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      msg: "Access denied.",
      variant: "error",
      payload: null,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({
      msg: "Invalid token.",
      variant: "error",
      payload: null,
    });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      msg: "Access denied.",
      variant: "error",
      payload: null,
    });
  }
  next();
};
