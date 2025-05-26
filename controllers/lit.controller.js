import { Bed, Room } from "../models/index.model.js";
import db from "../database/db.js";

export const getAllLits = async (req, res, next) => {
  try {
    const Lits = await Bed.findAll();
    return res.status(200).json({ nombre: Lits.length, LitsInfo: Lits });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getSingleLit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lit = await Bed.findByPk(id);

    if (!lit) {
      return res
        .status(400)
        .json({ message: "Ce lit n'existe pas dans notre système" });
    }
    return res.status(200).json({ litInfo: lit });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getLitByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    if (!status) {
      return res.status(400).json({
        message: "Le statut du lit est requis pour cette recherche.",
      });
    }
    const lit = await Bed.findAll({ where: { status } });

    if (lit.length === 0) {
      return res.status(404).json({
        message: `Aucun lit avec le statut '${status}' n'existe dans notre système.`,
      });
    }
    return res.status(200).json({ nombre: lit.length, litInfo: lit });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const getLitByNumber = async (req, res, next) => {
  try {
    const { bedNumber } = req.params;

    if (!bedNumber) {
      return res.status(400).json({
        message: "Le numéro de lit est requis pour cette recherche.",
      });
    }

    const lit = await Bed.findOne({ where: { bedNumber } });
    if (!lit) {
      return res.status(404).json({
        message: `Le lit avec le numéro '${bedNumber}' n'existe pas dans notre système.`,
      });
    }

    return res.status(200).json({ litInfo: lit });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const createBed = async (req, res, next) => {
  try {
    const { bedNumber, status, idRoom } = req.body;

    if (!bedNumber || !status) {
      return res
        .status(400)
        .json({ message: "Le numéro de lit et le statut sont requis." });
    }

    const existingBed = await Bed.findOne({ where: { bedNumber } });
    if (existingBed) {
      return res
        .status(409)
        .json({ message: `Le lit avec le numéro '${bedNumber}' existe déjà.` });
    }

    let room = null;
    if (idRoom) {
      room = await Room.findByPk(idRoom);
      if (!room) {
        return res
          .status(404)
          .json({ message: "La chambre spécifiée n'existe pas." });
      }
    }

    const newBed = await Bed.create({
      bedNumber,
      status,
      idRoom: idRoom || null,
    });

    return res.status(201).json({
      message: `Le lit '${newBed.bedNumber}' a été créé avec succès.`,
      bed: newBed,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const updateBed = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bedNumber, status, idRoom } = req.body;

    const bed = await Bed.findByPk(id);
    if (!bed) {
      return res
        .status(404)
        .json({ message: "Ce lit n'existe pas dans notre système." });
    }

    if (bedNumber && bedNumber !== bed.bedNumber) {
      const existingBedWithNumber = await Bed.findOne({
        where: { bedNumber },
      });
      if (existingBedWithNumber) {
        return res.status(409).json({
          message: `Le numéro de lit '${bedNumber}' est déjà utilisé par un autre lit.`,
        });
      }
    }

    let room = null;
    if (idRoom !== undefined) {
      if (idRoom !== null) {
        room = await Room.findByPk(idRoom);
        if (!room) {
          return res
            .status(404)
            .json({ message: "La chambre spécifiée n'existe pas." });
        }
      }
    }

    await bed.update({
      bedNumber: bedNumber !== undefined ? bedNumber : bed.bedNumber,
      status: status !== undefined ? status : bed.status,
      idRoom: idRoom !== undefined ? idRoom : bed.idRoom,
    });

    return res.status(200).json({
      message: `Le lit '${bed.bedNumber}' a été mis à jour avec succès.`,
      bed: bed,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const deleteBed = async (req, res, next) => {
  try {
    const { idBed } = req.params;

    const bed = await Bed.findByPk(idBed);
    if (!bed) {
      return res
        .status(404)
        .json({ message: "Ce lit n'existe pas dans notre système." });
    }

    await bed.destroy();

    return res.status(200).json({
      message: `Le lit '${bed.bedNumber}' a été supprimé avec succès.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const assignBedToRoom = async (req, res, next) => {
  const transaction = await db.transaction();
  try {
    const { idBed } = req.params;
    const { idRoom } = req.body;

    if (!idRoom) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "L'ID de la chambre est requis." });
    }

    const bed = await Bed.findByPk(idBed, { transaction });
    if (!bed) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Ce lit n'existe pas dans notre système." });
    }

    const room = await Room.findByPk(idRoom, { transaction });
    if (!room) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "La chambre spécifiée n'existe pas." });
    }

    if (bed.idRoom === idRoom) {
      await transaction.rollback();
      return res
        .status(409)
        .json({ message: "Ce lit est déjà affecté à cette chambre." });
    }

    await bed.update({ idRoom }, { transaction });

    await transaction.commit();
    return res.status(200).json({
      message: `Le lit '${bed.bedNumber}' a été affecté à la chambre '${room.roomNumber}' avec succès.`,
      bed: bed,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};

export const unassignBedFromRoom = async (req, res, next) => {
  const transaction = await db.transaction();
  try {
    const { idBed } = req.params;

    const bed = await Bed.findByPk(idBed, { transaction });
    if (!bed) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Ce lit n'existe pas dans notre système." });
    }

    if (bed.idBed === null) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Ce lit n'est actuellement pas affecté à une chambre.",
      });
    }

    const oldRoomId = bed.idBed;
    const oldRoom = await Room.findByPk(oldRoomId, { transaction });

    await bed.update({ idRoom: null }, { transaction });

    await transaction.commit();
    return res.status(200).json({
      message: `Le lit '${bed.bedNumber}' a été désaffecté de la chambre '${
        oldRoom ? oldRoom.roomNumber : "inconnue"
      }' avec succès.`,
      bed: bed,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
