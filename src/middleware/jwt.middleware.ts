import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: number;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ redirectToLogin: true, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ redirectToLogin: true, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = decoded.id;

    console.log(decoded.id);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTimestamp) {
      return res.status(401).json({
        isValid: false,
        redirectToLogin: true,
        message: "Token has expired",
      });
    }
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
