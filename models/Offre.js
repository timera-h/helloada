const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offreSchema = new Schema({
    intitulePoste: String,
    lieuPoste: {
        cp: Number,
        ville: String
    },
    typeContrat: {
        type: String,
        enum: ["cdd", "cdi", "ctt", "stage", "alternance"]
    },
    secteurActivite: String,
    niveauEtude: String,
    niveauPoste: {
        type: String,
        enum: ["junior", "senior"]
    },
    descriptionPoste: String,
    profilRecherche: String,
    salaire: Number,
    dateAnonce: Date, 
    dateDeb: Date,
    dateFin: Date
});

const offreModel = mongoose.model("Offre", offreSchema);

module.exports = offreModel;