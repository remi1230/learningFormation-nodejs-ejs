// middleware/authorizeRoles.js
module.exports = function authorizeRoles(allowedRoles = []) {
  return (req, res, next) => {
    const userRole = req.auth?.userRole;

    if (!userRole) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Accès interdit : rôle insuffisant.' });
    }

    next();
  };
};