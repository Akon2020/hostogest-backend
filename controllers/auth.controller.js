import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { EMAIL, HOST_URL, JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import { resetPasswordEmailTemplate } from "../utils/email.template.js";
import { valideEmail } from "../middlewares/email.middleware.js";

const generateToken = (user) => {
  return jwt.sign({ email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const register = async (req, res, next) => {
  try {
    const { nom, prenom, email, password } = req.body;

    if (!email || !password || !nom || !prenom) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }

    if (!valideEmail(email)) {
      return res
        .status(400)
        .json({ message: "Entrez une adresse mail valide" });
    }

    const userExists = await UserModel.findUserByEmail(email);
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur a déjà un compte" });
    }

    const userId = await UserModel.createUser({ nom, prenom, email, password });
    const token = generateToken({ id: userId, email });

    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      data: { token, user: userId },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.mot_de_passe))) {
      return res
        .status(409)
        .json({ message: "Email ou mot de passe incorrect" });
    }
    const loginToken = generateToken(user);
    res.cookie("token", loginToken);
    res.status(201).json({
      message: `Bienvenu ${user.prenom} 👋`,
      data: { token: loginToken, userInfo: user },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "L'email est requis" });
    }

    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        message:
          "Cet email n'est attaché à aucun compte! Veuillez vérifier votre email",
      });
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
      dev: {
        resetUrl: `${HOST_URL}/auth/resetpassword?token=${resetToken}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de l'envoi de l'email de réinitialisation! Réessayez plus tard",
    });
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token et nouveau mot de passe requis" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    const user = await UserModel.findUserByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await UserModel.updatePassword(user.id_utilisateur, newPassword);

    res.status(200).json({
      message:
        "Mot de passe réinitialisé avec succès! Connectez-vous maintenant",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la réinitialisation du mot de passe" });
    next(error);
  }
};
