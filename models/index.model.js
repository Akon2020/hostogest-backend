import db from "../database/db.js";
import User from "./user.model.js";
import Role from "./role.model.js";
import Permission from "./permission.model.js";
import Feature from "./feature.model.js";
import Room from "./room.model.js";
import Bed from "./bed.model.js";
import Patient from "./patient.model.js";
import Outing from "./outing.model.js";
import Hospitalization from "./hospitalization.model.js";
import Mensuration from "./mensuration.model.js";
import Antecedent from "./antecedent.model.js";
import Prescription from "./prescription.model.js";
import Consultation from "./consultation.model.js";
import ExamenType from "./examentype.model.js";
import Examen from "./examen.model.js";
import Intervention from "./intervention.model.js";
import Consommation from "./consommation.model.js";
import MedecineAdministration from "./medecineAdministration.model.js";
import Suivie from "./suivie.model.js";
import Abonnement from "./abonnement.model.js";
import MedicalRecord from "./medicalRecord.model.js";
import PermissionFeature from "./permissionFeature.model.js";
import RolePermission from "./rolePermission.model.js";
import UserRole from "./userRole.model.js";

// Definition des associations

// User - Role
User.belongsToMany(Role, { through: UserRole, foreignKey: "idUser" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "idRole" });
User.hasMany(UserRole, { foreignKey: "idUser" });
Role.hasMany(UserRole, { foreignKey: "idRole" });
UserRole.belongsTo(User, { foreignKey: "idUser" });
UserRole.belongsTo(Role, { foreignKey: "idRole" });

// Role - Permission
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "idRole",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "idPermission",
});
Role.hasMany(RolePermission, { foreignKey: "idRole" });
Permission.hasMany(RolePermission, { foreignKey: "idPermission" });
RolePermission.belongsTo(Role, { foreignKey: "idRole" });
RolePermission.belongsTo(Permission, { foreignKey: "idPermission" });

// Permission - Feature
Permission.belongsToMany(Feature, {
  through: PermissionFeature,
  foreignKey: "idPermission",
});
Feature.belongsToMany(Permission, {
  through: PermissionFeature,
  foreignKey: "idFeature",
});
Permission.hasMany(PermissionFeature, { foreignKey: "idPermission" });
Feature.hasMany(PermissionFeature, { foreignKey: "idFeature" });
PermissionFeature.belongsTo(Permission, { foreignKey: "idPermission" });
PermissionFeature.belongsTo(Feature, { foreignKey: "idFeature" });

// Room - Bed
Room.hasMany(Bed, { foreignKey: "idRoom" });
Bed.belongsTo(Room, { foreignKey: "idRoom" });

// User - Patient
User.hasMany(Patient, { foreignKey: "idUser" });
Patient.belongsTo(User, { foreignKey: "idUser" });

// Patient - Antecedent
Patient.hasMany(Antecedent, { foreignKey: "idPatient" });
Antecedent.belongsTo(Patient, { foreignKey: "idPatient" });

// Patient - Outing
Patient.hasMany(Outing, { foreignKey: "idPatient" });
Outing.belongsTo(Patient, { foreignKey: "idPatient" });
User.hasMany(Outing, { foreignKey: "idUser" });
Outing.belongsTo(User, { foreignKey: "idUser" });

// Patient - Hospitalization
Patient.hasMany(Hospitalization, { foreignKey: "idPatient" });
Hospitalization.belongsTo(Patient, { foreignKey: "idPatient" });
Outing.hasMany(Hospitalization, { foreignKey: "idOuting" });
Hospitalization.belongsTo(Outing, { foreignKey: "idOuting" });
Bed.hasMany(Hospitalization, { foreignKey: "idBed" });
Hospitalization.belongsTo(Bed, { foreignKey: "idBed" });

// Consultation
User.hasMany(Consultation, { foreignKey: "idUser" });
Consultation.belongsTo(User, { foreignKey: "idUser" });
Patient.hasMany(Consultation, { foreignKey: "idPatient" });
Consultation.belongsTo(Patient, { foreignKey: "idPatient" });
Mensuration.hasOne(Consultation, { foreignKey: "idMensuration" });
Consultation.belongsTo(Mensuration, { foreignKey: "idMensuration" });
Antecedent.hasOne(Consultation, { foreignKey: "idAntecedent" });
Consultation.belongsTo(Antecedent, { foreignKey: "idAntecedent" });
Prescription.hasOne(Consultation, { foreignKey: "idPrescription" });
Consultation.belongsTo(Prescription, { foreignKey: "idPrescription" });
Hospitalization.hasOne(Consultation, { foreignKey: "idHospitalization" });
Consultation.belongsTo(Hospitalization, { foreignKey: "idHospitalization" });

// Examen
Consultation.hasMany(Examen, { foreignKey: "idConsultation" });
Examen.belongsTo(Consultation, { foreignKey: "idConsultation" });
ExamenType.hasMany(Examen, { foreignKey: "idExamenType" });
Examen.belongsTo(ExamenType, { foreignKey: "idExamenType" });

// Suivie
Consultation.hasMany(Suivie, { foreignKey: "idConsultation" });
Suivie.belongsTo(Consultation, { foreignKey: "idConsultation" });
Intervention.hasMany(Suivie, { foreignKey: "idIntervention" });
Suivie.belongsTo(Intervention, { foreignKey: "idIntervention" });
Patient.hasMany(Suivie, { foreignKey: "idPatient" });
Suivie.belongsTo(Patient, { foreignKey: "idPatient" });
Consommation.hasMany(Suivie, { foreignKey: "idConsommation" });
Suivie.belongsTo(Consommation, { foreignKey: "idConsommation" });
MedecineAdministration.hasMany(Suivie, {
  foreignKey: "idMedecineAdministration",
});
Suivie.belongsTo(MedecineAdministration, {
  foreignKey: "idMedecineAdministration",
});
User.hasMany(Suivie, { foreignKey: "idUser" });
Suivie.belongsTo(User, { foreignKey: "idUser" });

// Abonnement
Patient.hasMany(Abonnement, { foreignKey: "idPatient" });
Abonnement.belongsTo(Patient, { foreignKey: "idPatient" });

// MedicalRecord
Patient.hasMany(MedicalRecord, { foreignKey: "idPatient" });
MedicalRecord.belongsTo(Patient, { foreignKey: "idPatient" });

// Synchronisation des modèles avec la base de données
const syncModels = async () => {
  try {
    await db.sync({ alter: false });
    console.log("Modèles synchronisés avec succès");
  } catch (error) {
    console.error("Erreur lors de la synchronisation des modèles:", error);
    throw error;
  }
};

// Export des modèles
export {
  User,
  Role,
  Permission,
  Feature,
  Room,
  Bed,
  Patient,
  Mensuration,
  Antecedent,
  Prescription,
  Outing,
  Hospitalization,
  Consultation,
  ExamenType,
  Examen,
  Intervention,
  Consommation,
  MedecineAdministration,
  Suivie,
  Abonnement,
  MedicalRecord,
  PermissionFeature,
  RolePermission,
  UserRole,
  syncModels,
};
