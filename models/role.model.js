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
}
