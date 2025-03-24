import db from "../database/db.js";

export default class RoleModel {
  static async findAllRoles() {
    const [rows] = await db.query("SELECT * FROM role");
    return rows;
  }

  static async findRoleById(id) {
    const [rows] = await db.query("SELECT * FROM role WHERE id_role = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findRoleByName(nom) {
    const [rows] = await db.query("SELECT * FROM role WHERE nom = ?", [nom]);
    return rows[0] || null;
  }

  static async createRole(nom) {
    const [result] = await db.query("INSERT INTO role (nom) VALUES (?)", [nom]);
    return result.insertId;
  }

  static async updateRole(id, nom) {
    const [info] = await db.query("UPDATE role SET nom = ? WHERE id_role = ?", [
      nom,
      id,
    ]);
    return info;
  }

  static async deleteRole(id) {
    const [supprim] = await db.query("DELETE FROM role WHERE id_role = ?", [
      id,
    ]);
    return supprim;
  }

  static async affectRole(idRole, idUser) {
    const [result] = await db.query(
      "INSERT INTO utilisateur_role (id_utilisateur, id_role) VALUES (?, ?)",
      [idRole, idUser]
    );
    return result.insertId;
  }

  static async checkUserRole(idUser, idRole) {
    const [rows] = await db.query(
      "SELECT * FROM utilisateur_role WHERE id_utilisateur = ? AND id_role = ?",
      [idUser, idRole]
    );
    return rows;
  }

  static async getUserRoles(idUser) {
    const [roles] = await db.query(
      "SELECT r.id_role, r.nom FROM role r INNER JOIN utilisateur_role ur ON r.id_role = ur.id_role WHERE ur.id_utilisateur = ?",
      [idUser]
    );
    return roles;
  }
}
