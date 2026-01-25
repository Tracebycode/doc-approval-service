// ---- REQUIRE ROLE MIDDLEWARE ----
import { authrequest } from "../storage/users";
import { NextFunction, Response } from "express";

// ---- REQUIRE ROLE MIDDLEWARE ----
export const requireRole = (role: 'manager' | 'writer') => {
  return (req: authrequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        message: `Requires ${role} role`
      });
    }

    next();
  };
};
