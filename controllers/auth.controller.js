import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { EMAIL, HOST_URL, JWT_SECRET } from "../config/env";
import transporter from "../config/nodemailer.js";
import { resetPasswordEmailTemplate } from "../utils/email.template.js";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });
};

export const register = async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  const userExists = await UserModel.findUserByEmail(email);
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
  const user = await UserModel.findUserByEmail(email);
  console.log("User.mot_de_passe: ", user.mot_de_passe);
  console.log("User.password: ", user.password);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  }
  res.cookie("token", generateToken(user));
  //   res.redirect("/dashboard");
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = UserModel.findUserByEmail(email);

  if (!user) {
    return res.status(400).json({ message: "Email introuvable" });
  }
  const resetToken = generateToken(user);
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Réinitialisation du mot de passe",
    html: resetPasswordEmailTemplate(user.nom, email, HOST_URL, resetToken),
  };
  await transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(500).json({
        message:
          "Erreur lors de l'envoi de l'email de réinitialisation! Veuillez réessayer",
      });
    }
    res.status(201).json({
      message:
        "Un email contenant les procédures de réinitialisation vous a été envoyé! Consulter votre boîte mail.",
    });
  });
};
