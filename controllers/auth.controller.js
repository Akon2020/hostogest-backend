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

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findUsersByEmail(email);
  console.log("User.mot_de_passe: ", user.mot_de_passe);
  console.log("User.password: ", user.password);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(400)
      .json({ message: "Email ou mot de passe incorrect." });
  }
  res.cookie("token", generateToken(user));
//   res.redirect("/dashboard");
};
