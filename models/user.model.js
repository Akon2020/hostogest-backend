import db from "../database/db.js";
import bcrypt from "bcryptjs";

export default class UserModel {
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM utilisateur WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM utilisateur WHERE id_utilisateur = ?",
      [id]
    );
    return rows[0] || null;
  }

  static async findAll() {
    const [rows] = await db.query("SELECT * FROM utilisateur");
    return rows;
  }

  static async createUser({ nom, prenom, email, mot_de_passe }) {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const [result] = await db.query(
      "INSERT INTO utilisateur (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)",
      [nom, prenom, email, hashedPassword]
    );
    return result.insertId;
  }

  static async updateUser(id, { nom, prenom, email }) {
    await db.query(
      "UPDATE utilisateur SET nom = ?, prenom = ?, email = ? WHERE id_utilisateur = ?",
      [nom, prenom, email, id]
    );
  }

  static async deleteUser(id) {
    await db.query("DELETE FROM utilisateur WHERE id_utilisateur = ?", [id]);
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      "UPDATE utilisateur SET mot_de_passe = ? WHERE id_utilisateur = ?",
      [hashedPassword, id]
    );
  }
}
