import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../config/env";
import transporter from "../config/nodemailer";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });
};

export const register = async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  const userExists = await UserModel.findUsersByEmail(email);
  if (userExists) {
    return res
      .status(400)
      .json({ message: "Cet utilisateur a déjà un compte" });
  }
  const userId = await UserModel.createUser({ nom, prenom, email, password });
  res.cookie("token", generateToken({ id: userId, email }));
//   res.redirect("/dashboard");
};
