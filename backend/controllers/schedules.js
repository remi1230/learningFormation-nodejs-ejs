//Importation du modèle représentant la structure des données en BDD pour la table schedules
const sequelize = require('../config/database');
const db      = require('../model');
const Schedules = db.Schedules;

const { getDayOrder } = require('../services/backoffice');

/**
 * Récupère tous les horaires
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAllSchedulesInJSON = async (req, res, next) => {
    await sequelize.query('USE dentiste');

    Schedules.findAll({order: [['order', 'ASC']]})
    .then(schedules => {
        if (!schedules) {
            return res.status(404).json({error: 'Aucun horaire de trouvé !'});
        }
        res.status(200).json(schedules);
    })
};

/**
 * Récupère un horaire par son ID
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getSchedulesById = async (req, res, next) => {
    await sequelize.query('USE dentiste');

    Schedules.findByPk(req.params.id)
    .then(schedules => {
        if (!schedules) {
            return res.status(404).json({error: 'Aucun horaire de trouvé !'});
        }
        res.status(200).json(schedules);
    })
    .catch(error => res.status(500).json({ error: 'Une erreur est survenue' })); // Gestion des erreurs
};

 /**
 * Met à jour un schedules existant ou en ajoute un nouveau.
 * Recherche le schedules par son ID fourni en paramètre de la requête et met à jour ses informations.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `dayOfWeek`, `openTime` et `closeTime`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.addOrUpdate = async (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json({ error: "You must be a professional to update a schedules!" })};

    const dayOfWeek = req.body.dayOfWeek;
    const openTime  = req.body.openTime;
    const closeTime = req.body.closeTime;

    await sequelize.query('USE dentiste');
    Schedules.findOne({ where: { dayOfWeek: dayOfWeek } })
    .then(async schedules => {
        if (!schedules) {
            await sequelize.query('USE dentiste');
            Schedules.create({
                dayOfWeek : dayOfWeek,
                openTime  : openTime,
                closeTime : closeTime,
                order     : getDayOrder(dayOfWeek),
            })
            .then(() => { res.status(201).json({message: 'Horaire enregistré !'})})
            .catch(error => { res.status(400).json( { error })})
        }
        else{
            await sequelize.query('USE dentiste');
            return schedules.update({
                openTime  : openTime,
                closeTime : closeTime,
            })
            .then(() => res.status(200).json({message: 'Horaire mis à jour !'}))
            .catch(error => res.status(400).json({error}));
        }
    })
    .catch(error => res.status(400).json({error}));
};

/**
 * Supprime un horaire existant basé sur le jour de la semaine.
 * Recherche l'horaire par son jour de la semaine fourni dans le corps de la requête et le supprime.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `dayOfWeek`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de suppression réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.deleteByDayOfWeek = async (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ 
        await sequelize.query('USE dentiste');
        return res.status(400).json({ error: "You must be a professional to delete a schedule!" });
    }

    const dayOfWeek  = req.params.dayOfWeek;

    await sequelize.query('USE dentiste');
    Schedules.findOne({ where: { dayOfWeek: dayOfWeek } })
        .then(schedule => {
            if (!schedule) {
                return res.status(404).json({error: 'Horaire pour ce jour non trouvé !'});
            }
            // Suppression de l'horaire trouvé
            return schedule.destroy()
                .then(() => res.status(200).json({message: 'Horaire supprimé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(400).json({error}));
};

/**
 * Supprime un horaire en base
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.delete = async (req, res, next) => {
    await sequelize.query('USE dentiste');
    if(req.auth.userRole !== 'Professional'){ 
        return res.status(400).json({ error: "You must be a professional to delete a schedule!" });
    }
    
    const id = req.params.id; // ou une autre logique pour obtenir l'ID
  
    // Modèle Sequelize pour l'objet que vous voulez supprimer, par exemple 'Item'
    Schedules.destroy({
      where: { id: id } // condition de correspondance
    })
    .then(result => {
      if (result === 0) {
        // Aucun objet trouvé avec cet ID, ou rien à supprimer
        return res.status(404).json({ message: 'Horaire non trouvé' });
      }
      // La suppression a été effectuée
      res.status(200).json({ message: 'Horaire supprimé avec succès !' });
    })
    .catch(error => {
      // Gérer l'erreur
      res.status(500).json({ message: 'Une erreur est survenue durant la suppression', error });
    });
};

/**
 * Récupère tous les horaires
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAll = async () => {
    try {
        // Forcer l'utilisation de la base de données si nécessaire
        await sequelize.query('USE dentiste');

        // Récupérer les horaires
        const schedules = await Schedules.findAll();

        // Retourner directement les horaires
        return schedules;
    } catch (err) {
        console.error('Erreur lors de la récupération des horaires :', err);
        throw new Error('Erreur lors de la récupération des horaires');
    }
};

