const express = require("express");
const router = express.Router();
const protectAdminRoute = require("./../middlewares/protectAdminRoute");
const protectEntrepriseRoute = require("./../middlewares/protectEntrepriseRoute");

// dans ce routeur, on mettre les routes génériques
// de notre shop, ex: about, contact, CGV, etc...
// n'ayant pas besoin de modele

/* GET home page. */
router.get("/", (req, res) => {
  res.render("home", { title: "Accueil",
  layout : false });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "A propos de HELLOADA" });
});


router.get("/accueil-entreprise/profile-candidats", protectEntrepriseRoute, (req, res) => {
  res.render("accueil-entreprise", { title: "Entreprise" });
});

router.get("/entreprise", (req, res) => {
  res.render("entreprise", { title: "Entreprise" });
});



router.get("/candidat", (req, res) => {
  res.render("candidat", { title: "Parcours Candidat" });
});


router.get("/contact", (req, res) => {
  res.render("contact", { title: "Nous contacter" });
});

router.get("/dashboard", protectAdminRoute, (req, res) => {
  res.render("dashboard/dashboard", {title: "Inerface d'administration"});
});

router.get("/mention-legal", (req, res) => {
  res.render("mention-legal", { title: "Mention legal" });
});

router.get("/condition", (req, res) => {
  res.render("condition", { title: "Les conditions d'utilisation" });
});

module.exports = router;
