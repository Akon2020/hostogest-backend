import db from "../database/db.js";

export default class MedicamentModel {
  static async findAllMedicaments() {
    const [rows] = await db.query("SELECT * FROM medicament");
    return rows;
  }

  static async findMedicamentById(id) {
    const [rows] = await db.query(
      "SELECT * FROM medicament WHERE id_medicament = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findMedicamentByName(nom) {
    const [rows] = await db.query("SELECT * FROM medicament WHERE nom = ?", [
      nom,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async createMedicament({ nom, description }) {
    const [result] = await db.query(
      "INSERT INTO medicament (nom, description) VALUES (?, ?)",
      [nom, description]
    );
    return result.insertId;
  }

  static async updateMedicament(id, { nom, description }) {
    const [info] = await db.query(
      "UPDATE medicament SET nom = ?, description = ? WHERE id_medicament = ?",
      [nom, description, id]
    );
    return info;
  }

  static async deleteMedicament(id) {
    const [supprim] = await db.query(
      "DELETE FROM medicament WHERE id_medicament = ?",
      [id]
    );
    return supprim;
  }
}
