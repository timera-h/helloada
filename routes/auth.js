const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const userModel = require("./../models/User");
const entrepriseModel = require("./../models/Entreprise");
// uploader est un middleware, cad une fonction qui s'insère entre une requête http et une réponse http
const uploader = require("./../config/cloudinary");
const passport = require('passport');


router.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Inscription",
    js: ["toggle-password-icon"]
  });
});


router.get("/signin", (req, res) => {
  res.render("signin", {
    title: "Connexion",
    js: ["toggle-password-icon"]
  });
});



router.get("/signout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

router.get('/auth/linkedin',
  passport.authenticate('linkedin', {
    scope: ['r_emailaddress', 'r_basicprofile'],
  
  }));

router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/',
  failureRedirect: '/failed'
}),
function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/good');

});

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failed'
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });


router.get('/failed', (req, res) => res.send('you failed to log in'));

// const isLoggedIn = (req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     res.sendStatus(401);
//   }
// };

router.get('/good', (req, res) => res.send('welcome ${req.user.prenom}'));


router.post("/signin",  (req, res, next) => {
  const userInfos = req.body; //
  // check que mail et mdp sont renseignés
  if (!userInfos.email || !userInfos.password) {
    // never trust user input !!!
    // si non : retourner message warning au client
    req.flash("warning", "Attention, email et password sont requis !");
    res.redirect("/signin");
  }
  // si oui : vérifier que mail et mdp correspondent en bdd
  // 1 - récupérer l'utilisateur avec le mail fourni
  userModel
    .findOne({
      email: userInfos.email
    })
    .then((user) => {
      if (!user) {
        // vaut null si pas d'user trouvé pour ce mail
        // si non .. retiourner une erreur au client
        req.flash("error", "Identifiants incorrects");
        res.redirect("/signin");
      }
      // si oui comparer le mdp crypté stocké en bdd avec la chaîne en clair envoyée depuis le formulaire
      const checkPassword = bcrypt.compareSync(
        userInfos.password, // password provenant du form "texte plein"
        user.password // password stocké en bdd (encrypté)
      ); // checkPassword vaut true || false

      // si le mdp est incorrect: retourner message error sur signin
      if (checkPassword === false) {
        req.flash("error", "Identifiants incorrects");
        res.redirect("/signin");
      }
      // si oui : stocker les infos de l'user en session pour lui permettre de naviguer jusqu'au signout
      const {
        _doc: clone
      } = {
        ...user
      }; // je clone l'user
      delete clone.password; // je supprime le mdp du clone (pas besoin de le stocker ailleurs qu'en bdd)
      req.session.currentUser = clone; // j'inscris le clone dans la session (pour maintenir un état de connexion)
      // - redirection profile
      res.redirect("/accueil-candidat/offres-emploi");
    })
    .catch(next);
});




router.post("/signup", uploader.single("cv"), (req, res, next) => {
  const user = req.body;
  console.log("ce que l'inscription candidat nous renvoie >>>>>>>>", req.body);

  if (req.body.not_checked) {
    console.log('not checked : ' + req.body.not_checked);
  }

  if (req.body.checked) {
    console.log('checked : ' + req.body.checked);
  }

  if (req.file) {
    // si un fichier a été uploadé
    user.cv = req.file.secure_url; // on l'associe à user
  }

  if (user.password != user.passwordConfirme || user.password === null || user.passwordConfirme === null) {
    req.flash("warning", "veuillez saisir un mot de passe correct");
    res.redirect("/signup");
  }

  if (!user.nom || !user.prenom || !user.password || !user.email || !user.linkedin) {
    // todo retourner un message d'erreur : remplir tous les champs requis + redirect
    req.flash("warning", "Merci de remplir tous les champs requis.");
    res.redirect("/signup");
  } else {
    userModel
      .findOne({
        email: user.email
      })
      .then((dbRes) => {
        if (dbRes) {
          // todo retourner message d'erreur : email déjà pris + redirect
          req.flash("warning", "Désolé, cet email n'est pas disponible.");
          res.redirect("/signup");
        }
      })
      .catch(next);
    // si le programme est lu jusqu'ici, on converti le mot de passe en chaîne cryptée
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(user.password, salt);
    // console.log("password crypté >>>", hashed);
    user.password = hashed; // on remplace le mot de passe "en clair" par sa version cryptée
    user.passwordConfirme = hashed;
    // finalement on insère le nouvel utilisateur en base de données
    userModel
      .create(user)
      .then((dbRes) => {
        req.flash("success", "Inscription validée !");
        res.redirect("/signin");
      })
      .catch(next);
  }
});


// router.post("/signupEntreprise", (req, res, next) => {
//   const user = req.body;

//   if (!user.nom || !user.password || !user.email) {
//     // todo retourner un message d'erreur : remplir tous les champs requis + redirect
//     req.flash("warning", "Merci de remplir tous les champs requis.");
//     res.redirect("/signupEntreprise");
//   } else {
//     entrepriseModel
//       .findOne({
//         email: user.email
//       })
//       .then((dbRes) => {
//         if (dbRes) {
//           // todo retourner message d'erreur : email déjà pris + redirect
//           req.flash("warning", "Désolé, cet email n'est pas disponible.");
//           res.redirect("/signupEntreprise");
//         }
//       })
//       .catch(next);

//     // si le programme est lu jusqu'ici, on converti le mot de passe en chaîne cryptée
//     const salt = bcrypt.genSaltSync(10);
//     const hashed = bcrypt.hashSync(user.password, salt);
//     // console.log("password crypté >>>", hashed);
//     user.password = hashed; // on remplace le mot de passe "en clair" par sa version cryptée

//     // finalement on insère le nouvel utilisateur en base de données
//     entrepriseModel
//       .create(user)
//       .then((dbRes) => {
//         req.flash("success", "Inscription validée !");
//         res.redirect("/signinEntreprise");
//       })
//       .catch(next);
//   }
// });


module.exports = router;