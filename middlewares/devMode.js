module.exports = (req, res, next) => {
  console.log("dev mode is on >>> ");
  req.session.currentUser = {
    _id: "5ee1f65361d80c5568ace8d2",
    nom: "nana",
    cv: "https://lataix-sebastien.developpez.com/tutoriels/latex/tutoriel-moderncv/images/classicred.png",
    role: "admin",
    email: "nana@mail.com",
  };
  next();
};
