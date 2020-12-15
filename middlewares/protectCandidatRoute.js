module.exports = function protectCandidatRoute(req, res, next) {
    if (req.session.currentUser && req.session.currentUser.role === "user" || req.session.currentUser && req.session.currentUser.role === "admin") next();
    else res.redirect("/signin");
};