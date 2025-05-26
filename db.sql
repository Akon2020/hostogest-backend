CREATE DATABASE IF NOT EXISTS HostoGest;
USE HostoGest;

CREATE TABLE User (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Role (
    idRole INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255) UNIQUE,
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE UserRole (
    idUser INT,
    idRole INT,
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idUser, idRole),
    FOREIGN KEY (idUser) REFERENCES User(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idRole) REFERENCES Role(idRole) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Feature (
    idFeature INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
) ENGINE=InnoDB;

CREATE TABLE Permission (
    idPermission INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) UNIQUE NOT NULL,
    description VARCHAR(255) UNIQUE NOT NULL,
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE RolePermission (
    idRole INT,
    idPermission INT,
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idRole, idPermission),
    FOREIGN KEY (idRole) REFERENCES Role(idRole) ON DELETE CASCADE,
    FOREIGN KEY (idPermission) REFERENCES Permission(idPermission) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE PermissionFeature (
    idPermission INT,
    idFeature INT,
    assignAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idPermission, idFeature),
    FOREIGN KEY (idPermission) REFERENCES Permission(idPermission) ON DELETE CASCADE,
    FOREIGN KEY (idFeature) REFERENCES Feature(idFeature) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Room (
    idRoom INT AUTO_INCREMENT PRIMARY KEY,
    roomNumber VARCHAR(20) NOT NULL,
    type ENUM('Privée', 'Commune') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Bed (
    idBed INT AUTO_INCREMENT PRIMARY KEY,
    bedNumber VARCHAR(20) NOT NULL,
    idRoom INT NOT NULL,
    status ENUM('Libre', 'Occupée') DEFAULT 'Libre',
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idRoom) REFERENCES Room(idRoom),
    UNIQUE(idRoom, bedNumber)
) ENGINE=InnoDB;

CREATE TABLE Patient (
    idPatient INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    birthDate DATE NOT NULL,
    gender ENUM('M', 'F') NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES User(idUser)
) ENGINE=InnoDB;

CREATE TABLE Mensuration (
    idMensuration INT AUTO_INCREMENT PRIMARY KEY,
    temperature INT,
    respiratoryRate INT,
    heartRate INT,
    bloodPressure INT,
    weight INT,
    size INT,
    bodyMassIndex INT,
    bloodOxygenSaturation INT,
    pignetIndex INT,
    passedOn DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Antecedent (
    idAntecedent INT AUTO_INCREMENT PRIMARY KEY,
    idPatient INT,
    description VARCHAR(255),
    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient)
) ENGINE=InnoDB;

CREATE TABLE Prescription (
    idPrescription INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE Outing (
    idOuting INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT,
    idPatient INT,
    outingDiagnostic VARCHAR(255),
    status ENUM('True', 'False') DEFAULT 'False' NOT NULL,
    approvedDate DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES User(idUser),
    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient)
) ENGINE=InnoDB;

CREATE TABLE Hospitalization (
    idHospitalization INT AUTO_INCREMENT PRIMARY KEY,
    idPatient INT,
    idOuting INT,
    idBed INT,
    admissionDate DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255),
    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient) ON DELETE CASCADE,
    FOREIGN KEY (idOuting) REFERENCES Outing(idOuting) ON DELETE CASCADE,
    FOREIGN KEY (idBed) REFERENCES Bed(idBed) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Consultation (
    idConsultation INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT,
    idPatient INT,
    idMensuration INT,
    idAntecedent INT,
    idPrescription INT,
    idHospitalization INT,
    motif VARCHAR(255),
    anamnese VARCHAR(255),
    conclusion VARCHAR(255),
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES User(idUser) ON DELETE CASCADE,
    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient) ON DELETE CASCADE,
    FOREIGN KEY (idMensuration) REFERENCES Mensuration(idMensuration) ON DELETE CASCADE,
    FOREIGN KEY (idAntecedent) REFERENCES Antecedent(idAntecedent) ON DELETE CASCADE,
    FOREIGN KEY (idPrescription) REFERENCES Prescription(idPrescription) ON DELETE CASCADE,
    FOREIGN KEY (idHospitalization) REFERENCES Hospitalization(idHospitalization) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ExamenType (
    idExamenType INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE Examen (
    idExamen INT AUTO_INCREMENT PRIMARY KEY,
    idConsultation INT,
    idExamenType INT,
    nom VARCHAR(255),
    resultat VARCHAR(255),
    status ENUM('Fait', 'Attente') DEFAULT 'Attente' NOT NULL,
    laboratoire VARCHAR(255),
    examenDate DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idConsultation) REFERENCES Consultation(idConsultation) ON DELETE CASCADE,
    FOREIGN KEY (idExamenType) REFERENCES ExamenType(idExamenType) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Intervention (
    idIntervention INT AUTO_INCREMENT PRIMARY KEY,
    intervationType VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE Consommation (
    idConsommation INT AUTO_INCREMENT PRIMARY KEY,
    designation VARCHAR(255),
    quantite INT,
    unite VARCHAR(100),
    prixUnitaire DECIMAL(10,2),
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE MedecineAdministration (
    idMedecineAdministration INT AUTO_INCREMENT PRIMARY KEY,
    nomMedicament VARCHAR(255),
    AdministrationDate DATETIME NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Suivie (
    idSuivie INT AUTO_INCREMENT PRIMARY KEY,
    idConsultation INT,
    idIntervention INT,
    idPatient INT,
    idConsommation INT,
    idMedecineAdministration INT,
    idUser INT,
    service VARCHAR(255),
    suivieDate DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idConsultation) REFERENCES Consultation(idConsultation) ON DELETE CASCADE,
    FOREIGN KEY (idIntervention) REFERENCES Intervention(idIntervention) ON DELETE CASCADE,
    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient) ON DELETE CASCADE,
    FOREIGN KEY (idConsommation) REFERENCES Consommation(idConsommation) ON DELETE CASCADE,
    FOREIGN KEY (idMedecineAdministration) REFERENCES MedecineAdministration(idMedecineAdministration) ON DELETE CASCADE,
    FOREIGN KEY (idUser) REFERENCES User(idUser) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Abonnement (
    idAbonnement INT AUTO_INCREMENT PRIMARY KEY,
    idPatient INT,
    organisation VARCHAR(255),
    abonnementDate DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE MedicalRecord (
    idMedicalRecord INT AUTO_INCREMENT PRIMARY KEY,
    idPatient INT,
    type VARCHAR(255),
    description VARCHAR(255),
    createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient) ON DELETE CASCADE
) ENGINE=InnoDB;

-- index pour optimiser les recherches dans la base de données

-- Pour les connexions et recherches utilisateurs
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_name ON User(firstName, lastName);

-- Pour la recherche des permissions par rôle
CREATE INDEX idx_rolepermission_role ON RolePermission(idRole);
CREATE INDEX idx_rolepermission_permission ON RolePermission(idPermission);

-- Pour la recherche rapide des lits par chambre
CREATE INDEX idx_bed_room ON Bed(idRoom);

-- Pour la recherche de patients
CREATE INDEX idx_patient_user ON Patient(idUser);
CREATE INDEX idx_patient_name ON Patient(firstName, lastName);

-- Pour la recherche d'hospitalisations
CREATE INDEX idx_hosp_patient ON Hospitalization(idPatient);
CREATE INDEX idx_hosp_outing ON Hospitalization(idOuting);

-- Pour la recherche des consultations
CREATE INDEX idx_consult_user ON Consultation(idUser);
CREATE INDEX idx_consult_patient ON Consultation(idPatient);

-- Pour les examens
CREATE INDEX idx_exam_consult ON Examen(idConsultation);
CREATE INDEX idx_exam_type ON Examen(idExamenType);

-- Pour le suivi médical
CREATE INDEX idx_suivie_patient ON Suivie(idPatient);
CREATE INDEX idx_suivie_user ON Suivie(idUser);

-- Lits disponibles par chambre
SELECT 
    r.idRoom AS idRoom,
    COUNT(b.idBed) AS availableBeds
FROM Room r
JOIN Bed b ON r.idRoom = b.idRoom
WHERE b.status = 'Libre'
GROUP BY r.idRoom;


-- Liste des patients actuellement hospitalisés
SELECT 
    p.idPatient,
    CONCAT(p.firstName, ' ', p.lastName) AS patientName,
    h.admissionDate,
    b.idBed AS idBed,
    r.idRoom AS idRoom,
    r.roomNumber
FROM Hospitalization h
JOIN Patient p ON h.idPatient = p.idPatient
JOIN Bed b ON h.idBed = b.idBed
JOIN Room r ON b.idRoom = r.idRoom
WHERE h.idOuting IS NULL
LIMIT 0, 25;

-- Dossier médical complet pour un patient ---
-- Infos générales du patient + antécédents
SELECT 
  p.idPatient,
  CONCAT(p.firstName, ' ', p.lastName) AS fullName,
  p.gender,
  p.birthDate,
  p.address,
  p.phone,
  p.email,
  p.createdAt,
  a.description AS antecedent
FROM Patient p
LEFT JOIN Antecedent a ON p.idPatient = a.idPatient
WHERE p.idPatient = ?

-- Liste des consultations + mensurations + médecin + prescriptions
SELECT 
  c.idConsultation,
  c.motif,
  c.anamnese,
  c.conclusion,
  c.createdAt,
  m.temperature,
  m.respiratoryRate,
  m.heartRate,
  m.bloodPressure,
  m.weight,
  m.size,
  m.bodyMassIndex,
  m.bloodOxygenSaturation,
  m.pignetIndex,
  pr.description AS prescription,
  CONCAT(u.firstName, ' ', u.lastName) AS doctor
FROM Consultation c
LEFT JOIN Mensuration m ON c.idMensuration = m.idMensuration
LEFT JOIN Prescription pr ON c.idPrescription = pr.idPrescription
LEFT JOIN User u ON c.idUser = u.idUser
WHERE c.idPatient = ?
ORDER BY c.createdAt DESC

-- Historique d'hospitalisations et sorties
SELECT 
  h.idHospitalization,
  h.admissionDate,
  h.description,
  o.outingDiagnostic,
  o.status,
  o.approvedDate
FROM Hospitalization h
LEFT JOIN Outing o ON h.idOuting = o.idOuting
WHERE h.idPatient = ?
ORDER BY h.admissionDate DESC

-- Résultats d'examens biologiques ou imagerie
SELECT 
  e.idExamen,
  e.nom,
  e.resultat,
  e.status,
  e.laboratoire,
  e.examenDate,
  CONCAT(u.firstName, ' ', u.lastName) AS doctor
FROM Examen e
LEFT JOIN Consultation c ON e.idConsultation = c.idConsultation
LEFT JOIN User u ON c.idUser = u.idUser
WHERE c.idPatient = ?
ORDER BY e.examenDate DESC

-- Suivis post-consultation, interventions, consommations
SELECT 
  s.idSuivie,
  s.suivieDate,
  s.service,
  i.intervationType,
  cs.designation,
  cs.quantite,
  cs.unite,
  cs.prixUnitaire
FROM Suivie s
LEFT JOIN Intervention i ON s.idIntervention = i.idIntervention
LEFT JOIN Consommation cs ON s.idConsommation = cs.idConsommation
WHERE s.idPatient = ?
ORDER BY s.suivieDate DESC

-- Autres documents médicaux (certificats, rapports, etc.)
SELECT 
  mr.idMedicalRecord,
  mr.type,
  mr.description,
  mr.createdAt
FROM MedicalRecord mr
WHERE mr.idPatient = ?
ORDER BY mr.createdAt DESC

-- Suivie médicale (Pour les mensurations d'un patient)
SELECT 
    s.suivieDate AS date_suivie,
    m.temperature AS température,
    m.bloodPressure AS tension_artérielle,
    m.heartRate AS fréquence_cardiaque,
    m.respiratoryRate AS fréquence_respiratoire,
    CONCAT(u.firstName, ' ', u.lastName) AS personnel_suivi
FROM Suivie s
JOIN Consultation c ON s.idConsultation = c.idConsultation
JOIN Mensuration m ON c.idMensuration = m.idMensuration
JOIN User u ON s.idUser = u.idUser
WHERE s.idPatient = 1
ORDER BY s.suivieDate DESC;


-- Historique des consultations d'un patient
SELECT 
    c.createdAt AS consultationDate,
    c.motif AS reason,
    c.anamnese,
    c.conclusion,
    u.firstName AS doctorFirstName,
    u.lastName AS doctorLastName
FROM Consultation c
JOIN User u ON c.idUser = u.id
WHERE c.idPatient = 1
ORDER BY c.createdAt DESC;

-- Examens liés à une consultation
SELECT 
    e.nom AS examName,
    e.resultat,
    e.laboratoire,
    et.description AS type,
    e.examenDate
FROM Examen e
JOIN ExamenType et ON e.idExamenType = et.idExamenType
WHERE e.idConsultation = 1
ORDER BY e.examenDate DESC;


-- List occupés avec leurs patients
SELECT 
    b.idBed AS idBed,
    r.id AS idRoom,
    CONCAT(p.firstName, ' ', p.lastName) AS patientName,
    h.admissionDate
FROM Bed b
JOIN Hospitalization h ON b.idBed = h.idBed
JOIN Patient p ON h.idPatient = p.idPatient
JOIN Room r ON b.idRoom = r.id
WHERE h.idOuting IS NULL;

-- Patients sortis récemment avec date de sortie
SELECT 
    p.idPatient,
    CONCAT(p.firstName, ' ', p.lastName) AS patientName,
    o.createdAt AS sortieDate,
    o.description
FROM Outing o
JOIN Patient p ON o.idPatient = p.idPatient
ORDER BY o.createdAt DESC;

-- Liste des médicaments administrés aujourd'hui
SELECT 
    nomMedicament,
    AdministrationDate
FROM AdministrationMedicament
WHERE DATE(AdministrationDate) = CURDATE();

-- Consultations par médecin aujourd'hui
SELECT 
    u.firstName AS doctor,
    COUNT(c.id) AS consultationsToday
FROM Consultation c
JOIN User u ON c.idUser = u.id
WHERE DATE(c.createdAt) = CURDATE()
GROUP BY u.id;