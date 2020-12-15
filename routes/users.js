const express = require("express");
const router = new express.Router();
const userModel = require("./../models/User");
const bcrypt = require("bcrypt");
const uploader = require("./../config/cloudinary");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");
const protectAdminRoute = require("./../middlewares/protectAdminRoute");
const protectCandidatRoute = require("./../middlewares/protectCandidatRoute");


router.get("/profile", protectPrivateRoute, (req, res) => {
  res.render("profile");
});

// router.get("/accueil-candidat/offres-emploi", protectCandidatRoute, (req, res) => {
//   res.render("accueil-candidat", { title: "Candidat" });
// });

router.get("/dashboard/manage-users", protectAdminRoute, (req, res, next) => {
  // à vous de jouer sur le même principe qu'avec les products....
  // lire tous les users en db, puis render une vue avec une table qui liste tous les users
  userModel
    .find()
    .then((dbRes) => {
      //console.log("find all users >>> ", dbRes);
      res.render("dashboard/manage-users", {
        users: dbRes,
        title: "Gérer les utilisateurs",
      });
    })
    .catch(next);
});

router.get("/dashboard/users/edit/:id", protectAdminRoute, (req, res, next) => {
  // récupère un user par id puis render un formulaire d'édition
  // ce form ne permet d'éditer que le role de l'user (admin, editor, user)
  userModel
    .findById(req.params.id)
    .then((dbRes) => {
      //console.log("find one user by id >>> ", dbRes);
      res.render("dashboard/form-edit-user", {
        user: dbRes,
        title: "Editer un utilisateur",
      });
    })
    .catch(next);
});

router.post(
  "/profile/edit/infos/:id",
  uploader.single("cv"),
  (req, res, next) => {
    const updatedUserInfos = req.body; // on stocke les infos postées dans cette constante
    if (
      // on vérifie la présence de tous les champs requis
      !updatedUserInfos.nom ||
      !updatedUserInfos.email
    ) {
      // todo => return message erreur
    }

    if (req.file) updatedUserInfos.cv = req.file.secure_url;
    // check la doc : https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    userModel // on update l'user par son id en fournissant les données postées
      .findByIdAndUpdate(req.params.id, updatedUserInfos, { new: true }) // attention à l'option new: true
      .then((updatedUser) => {
        req.session.currentUser = updatedUser;
        req.flash("success", "Votre profile à été mis à jour !");

        res.redirect("/profile");
      })
      .catch(next);
  }
);

router.post("/profile/edit/password/:id", (req, res, next) => {
  const updatedUserInfos = req.body; // on stocke les infos postées dans cette constante
  if (
    // on vérifie la présence de tous les champs requis
    !updatedUserInfos.oldPassword ||
    !updatedUserInfos.password
  ) {
    // todo => return message erreur
  }
  userModel // on cherche l'user par son id
    .findById(req.params.id) // pour pouvoir comparer l'ancien pot de passe
    .then((user) => {
      // si la promesse est tenue, on vérifie que oldPassword est correct
      const checkOldPassword = bcrypt.compareSync(
        updatedUserInfos.oldPassword, // password provenant du form "texte plein"
        user.password // password stocké en bdd (encrypté)
      ); // compareSync retourne true || false

      if (checkOldPassword === false) {
        // si le oldPassword renseigné n'est pas le bon
        // todo => return message erreur
      } else {
        // si oldPassword renseigné est correct
        const salt = bcrypt.genSaltSync(10); // on génère un sel pour renforcer le hashage
        const hashed = bcrypt.hashSync(updatedUserInfos.password, salt); // encrypte nouveau password

        user.password = hashed; // on remplace le mot de passe "en clair" par le hash
        user.save(); // et enfin on update le document user récupéré de la bdd avec les nouvelles infos
        req.flash("success", "Votre profile à été mis à jour !");

        res.redirect("/profile");
      }
    })
    .catch(next);
});

router.post("/users/edit/:id", (req, res, next) => {
  // lire et mettre à jour un user en utilisant son id (req.params)
  userModel
    .findByIdAndUpdate(req.params.id, req.body)
    .then((dbRes) => {
      //console.log("edit one user >>>> ", dbRes);
      res.redirect("/dashboard/manage-users");
    })
    .catch(next);
});

router.post("/users/delete/:id", (req, res, next) => {
  // supprime un user par son id  (req.params)
  // puis redirige vers le manager users
  userModel
    .findByIdAndDelete(req.params.id)
    .then((dbRes) => {
      //console.log("delete one users >>> ", dbRes);
      res.redirect("/dashboard/manage-users");
    })
    .catch(next);
});

module.exports = router;
