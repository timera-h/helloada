const express = require("express");
const router = new express.Router();
const offreModel = require("./../models/Offre");
const protectCandidatRoute = require("./../middlewares/protectCandidatRoute");


// // voir les offres d'emploi
// router.get("/offres-emploi/", (req, res) => {
//     res.render("accueil-candidat", {
//         title: "Offres d'emploi"
//     })
// })

// voir une offre d'emploi par son id
router.get("/accueil-candidat/offres-emploi/:id", protectCandidatRoute, async (req, res, next) => {
    try {
        const offre = await offreModel.findById(req.params.id);
        res.render("accueil-candidat", {offre, title: "Offre d'emploi"});
    } catch(dbErr) {
        next(dbErr);
    }
});

router.post("/offres-emploi", (req, res, next) => {
    offreModel
        .create(req.body)
        // rediriger vers la page de création d'offre d'emploi
        .then(() => res.redirect("/")) 
        .catch(next);
});

module.exports = router;