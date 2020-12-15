module.exports = function exposeLoginStatus(req, res, next) {
  if (!req.session.currentUser) {
    // il n'y pas d'user correspondant à ce client stocké en session
    res.locals.currentUser = undefined; // les variables suivantes sont dispos pour le template
    res.locals.isLoggedIn = false;
    res.locals.isAdmin = false;
    res.locals.isNotLoggedIn = true;
  } else {
    // l'user correspondant à ce client est bien stocké en session
    res.locals.currentUser = req.session.currentUser;
    res.locals.isLoggedIn = true;
    res.locals.candidatUser = req.session.currentUser.role === "user";
    res.locals.entrepriseUser = req.session.currentUser.role === "entreprise";
    res.locals.isAdmin = req.session.currentUser.role === "admin";
  }
  next();
};
