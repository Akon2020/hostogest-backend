import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const authenticationJWT = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;
    next();
  });
};
