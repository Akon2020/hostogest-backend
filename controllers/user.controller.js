import { valideEmail } from "../middlewares/email.middleware.js";
import UserModel from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAllUsers();
    return res.status(200).json({ nombre: users.length, utilisateurs: users });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findUserById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur n'existe pas dans notre système" });
    }
    return res.status(200).json({ utilisateur: user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateUserInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email } = req.body;

    if (!email || !prenom || !nom) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tout les champs!" });
    }

    if (!valideEmail(email)) {
      return res
        .status(400)
        .json({ message: "Entrez une adresse mail valide" });
    }

    const userExist = await UserModel.findUserById(id);
    if (!userExist) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur n'existe pas dans notre système" });
    }

    const user = await UserModel.updateUser(id, { nom, prenom, email });
    if (user.affectedRows > 0) {
      res.status(200).json({
        message: `Les informations de ${userExist.prenom} ${userExist.nom} ont été mis à jour avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userExist = await UserModel.findUserById(id);

    if (!userExist) {
      return res
        .status(400)
        .json({ message: "Cet utilisateur n'exite pas dans notre système" });
    }
    const deleteUser = await UserModel.deleteUser(id);

    if (deleteUser.affectedRows > 0) {
      res.status(200).json({
        message: `L'utilisateur ${userExist.prenom} ${userExist.nom} supprimé avec succès`,
      });
    } else {
      res.status(404).json({ message: "Information non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
