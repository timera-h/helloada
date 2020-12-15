module.exports = function protectEntrepriseRoute(req, res, next) {
    if (req.session.currentUser && req.session.currentUser.role === "entreprise" || req.session.currentUser && req.session.currentUser.role === "admin") next();
    else res.redirect("/signin");
};