import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { EMAIL, HOST_URL, JWT_SECRET } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import { resetPasswordEmailTemplate } from "../utils/email.template.js";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });
};

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    const userExists = await UserModel.findUserByEmail(email);
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur a déjà un compte" });
    }
    const userId = await UserModel.createUser({ nom, prenom, email, password });
    const token = generateToken({ id: userId, email });

    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(201).json({ message: "Utilisateur créé avec succès", token });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.mot_de_passe))) {
    return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  }
  res.cookie("token", generateToken(user));
  //   res.redirect("/dashboard");
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findUserByEmail(email);

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
