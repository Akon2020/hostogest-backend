import db from "../database/db.js";

export default class PatientModel {
  static async findAllPatients() {
    const [rows] = await db.query("SELECT * FROM patient");
    return rows;
  }

  static async findPatientById(id) {
    const [rows] = await db.query(
      "SELECT * FROM patient WHERE id_patient = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findPatientByName(nom, prenom) {
    const [rows] = await db.query(
      "SELECT * FROM patient WHERE nom = ? OR prenom = ?",
      [nom, prenom]
    );
    return rows[0] || null;
  }
  static async createPatient({
    nom,
    prenom,
    dateNaissance,
    sexe,
    email,
    tel,
    adresse,
    categorie,
    etatCivil,
    profession,
    religion,
    motifConsultation,
    antecedents,
    complementAnamnese,
    temperature,
    frequenceRespir,
    frequenceCardiaque,
    tauxA,
    poids,
    taille,
    indiceMasseCorpo,
    SpO,
    indicePignet,
    dateHeureAdmission,
  }) {
    const [result] = await db.query("", [
      nom,
      prenom,
      dateNaissance,
      sexe,
      email,
      tel,
      adresse,
      categorie,
      etatCivil,
      profession,
      religion,
      motifConsultation,
      antecedents,
      complementAnamnese,
      temperature,
      frequenceRespir,
      frequenceCardiaque,
      tauxA,
      poids,
      taille,
      indiceMasseCorpo,
      SpO,
      indicePignet,
      dateHeureAdmission,
    ]);
    return result.insertId;
  }

  static async updatePatient(
    id,
    {
      nom,
      prenom,
      dateNaissance,
      sexe,
      email,
      tel,
      adresse,
      categorie,
      etatCivil,
      profession,
      religion,
      motifConsultation,
      antecedents,
      complementAnamnese,
      temperature,
      frequenceRespir,
      frequenceCardiaque,
      tauxA,
      poids,
      taille,
      indiceMasseCorpo,
      SpO,
      indicePignet,
      dateHeureAdmission,
    }
  ) {
    const [info] = await db.query("", [
      nom,
      prenom,
      dateNaissance,
      sexe,
      email,
      tel,
      adresse,
      categorie,
      etatCivil,
      profession,
      religion,
      motifConsultation,
      antecedents,
      complementAnamnese,
      temperature,
      frequenceRespir,
      frequenceCardiaque,
      tauxA,
      poids,
      taille,
      indiceMasseCorpo,
      SpO,
      indicePignet,
      dateHeureAdmission,
      id,
    ]);
    return info;
  }

  static async deletePatient(id) {
    const [supprim] = await db.query(
      "DELETE FROM patient WHERE id_patient = ?",
      [id]
    );
    return supprim;
  }
}
