CREATE DATABASE IF NOT EXISTS HostoGest;
USE HostoGest;

CREATE TABLE PATIENT (
    id_patient INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    sexe ENUM('M', 'F') NOT NULL,
    budget DECIMAL(10,2) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE CHAMBRE (
    id_chambre INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) NOT NULL UNIQUE,
    type ENUM('Individuelle', 'Commune') NOT NULL,
    tarif DECIMAL(10,2) NOT NULL,
    statut ENUM('Libre', 'Occupée') DEFAULT 'Libre'
) ENGINE=InnoDB;

CREATE TABLE LIT (
    id_lit INT AUTO_INCREMENT PRIMARY KEY,
    id_chambre INT NOT NULL,
    statut ENUM('Libre', 'Occupé') DEFAULT 'Libre',
    FOREIGN KEY (id_chambre) REFERENCES CHAMBRE(id_chambre) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ROLE (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE UTILISATEUR (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE UTILISATEUR_ROLE (
    id_utilisateur INT NOT NULL,
    id_role INT NOT NULL,
    PRIMARY KEY (id_utilisateur, id_role),
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_role) REFERENCES ROLE(id_role) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE HOSPITALISATION (
    id_hospitalisation INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT NOT NULL,
    id_lit INT NOT NULL,
    date_entree DATE NOT NULL,
    date_sortie DATE DEFAULT NULL,
    FOREIGN KEY (id_patient) REFERENCES PATIENT(id_patient) ON DELETE CASCADE,
    FOREIGN KEY (id_lit) REFERENCES LIT(id_lit) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE VISITE_MEDECIN (
    id_visite INT AUTO_INCREMENT PRIMARY KEY,
    id_hospitalisation INT NOT NULL,
    id_utilisateur INT NOT NULL,
    date_visite DATE NOT NULL,
    heure_visite TIME NOT NULL,
    observations TEXT,
    FOREIGN KEY (id_hospitalisation) REFERENCES HOSPITALISATION(id_hospitalisation) ON DELETE CASCADE,
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE PRESCRIPTION (
    id_prescription INT AUTO_INCREMENT PRIMARY KEY,
    id_hospitalisation INT NOT NULL,
    id_utilisateur INT NOT NULL,
    date_prescription DATE NOT NULL,
    FOREIGN KEY (id_hospitalisation) REFERENCES HOSPITALISATION(id_hospitalisation) ON DELETE CASCADE,
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE MEDICAMENT (
    id_medicament INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
) ENGINE=InnoDB;

CREATE TABLE PRESCRIPTION_MEDICAMENT (
    id_prescription INT NOT NULL,
    id_medicament INT NOT NULL,
    quantite INT NOT NULL,
    frequence VARCHAR(50),
    PRIMARY KEY (id_prescription, id_medicament),
    FOREIGN KEY (id_prescription) REFERENCES PRESCRIPTION(id_prescription) ON DELETE CASCADE,
    FOREIGN KEY (id_medicament) REFERENCES MEDICAMENT(id_medicament) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ALERTE_MEDICALE (
    id_alerte INT AUTO_INCREMENT PRIMARY KEY,
    id_hospitalisation INT NOT NULL,
    type_alerte ENUM('Overdose', 'Médicament non pris', 'Autre') NOT NULL,
    message TEXT NOT NULL,
    date_alerte DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('Non traitée', 'Résolue') DEFAULT 'Non traitée',
    FOREIGN KEY (id_hospitalisation) REFERENCES HOSPITALISATION(id_hospitalisation) ON DELETE CASCADE
) ENGINE=InnoDB;
