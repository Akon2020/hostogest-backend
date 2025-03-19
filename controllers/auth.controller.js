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
  try {
    const { email, password } = req.body;
    const user = await UserModel.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.mot_de_passe))) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }
    res.cookie("token", generateToken(user));
    res.status(201).json({
      message: "Utilisateur connecté avec succès",
      token: generateToken(user),
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const resetPassword = async (req, res) => {
  try {
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
      html: resetPasswordEmailTemplate(
        user.prenom,
        email,
        HOST_URL,
        resetToken
      ),
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message:
        "Un email de réinitialisation vous a été envoyé! Consultez votre boîte mail",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    res
      .status(500)
      .json({
        message:
          "Erreur lors de l'envoi de l'email de réinitialisation! Réessayez plus tard",
      });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur lors de la réinitialisation du mot de passe :",
        error,
      });
  }
};
