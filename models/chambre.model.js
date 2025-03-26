import db from "../database/db.js";

export default class ChambreModel {
  static async findAllChambres() {
    const [rows] = await db.query("SELECT * FROM chambre");
    return rows;
  }

  static async findChambreById(id) {
    const [rows] = await db.query(
      "SELECT * FROM chambre WHERE id_chambre = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findChambreByNum(num) {
    const [rows] = await db.query("SELECT * FROM chambre WHERE numero = ?", [
      num,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findChambreByType(type) {
    const [rows] = await db.query("SELECT * FROM chambre WHERE type = ?", [
      type,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findChambreByTarif(tarif) {
    const [rows] = await db.query("SELECT * FROM chambre WHERE tarif = ?", [
      tarif,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findChambreByStatus(statut) {
    const [rows] = await db.query("SELECT * FROM chambre WHERE statut = ?", [
      statut,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async createChambre({ numero, type, tarif }) {
    const [result] = await db.query(
      "INSERT INTO chambre (numero, type, tarif) VALUES (?, ?, ?)",
      [numero, type, tarif]
    );
    return result.insertId;
  }

  static async updateChambre(id, { numero, type, tarif, statut }) {
    const [info] = await db.query(
      "UPDATE chambre SET numero = ?, type = ?, tarif = ?, statut = ? WHERE id_chambre = ?",
      [numero, type, tarif, statut, id]
    );
    return info;
  }

  static async deleteChambre(id) {
    const [supprim] = await db.query(
      "DELETE FROM chambre WHERE id_chambre = ?",
      [id]
    );
    return supprim;
  }
}
