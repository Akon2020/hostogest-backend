import db from "../database/db.js";

export default class LitModel {
  static async findAllLits() {
    const [rows] = await db.query("SELECT * FROM lit");
    return rows;
  }

  static async findLitById(id) {
    const [rows] = await db.query("SELECT * FROM lit WHERE id_lit = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findLitByStatus(statut) {
    const [rows] = await db.query("SELECT * FROM lit WHERE statut = ?", [
      statut,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async createLit(idChambre) {
    const [result] = await db.query("INSERT INTO lit (id_chambre) VALUES (?)", [
      idChambre,
    ]);
    return result.insertId;
  }

  static async updateLit(id, { idChambre, statut }) {
    const [info] = await db.query(
      "UPDATE lit SET id_chambre = ?, statut = ? WHERE id_lit = ?",
      [idChambre, statut, id]
    );
    return info;
  }

  static async deleteLit(id) {
    const [supprim] = await db.query("DELETE FROM lit WHERE id_lit = ?", [id]);
    return supprim;
  }
}
