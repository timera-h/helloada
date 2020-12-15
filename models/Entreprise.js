const mongoose = require("mongoose");
const { schema } = require("./User");
const Schema = mongoose.Schema;

const entrepriseSchema = new Schema({
nomEntreprise: String,
tailleEntreprise: String,
secteurActivite: String,
pitch: String,
ville: String,
codePostale: Number,
offre: [{
  type: Schema.Types.ObjectId,
  ref: "Offre",
}],
nom: String,
prenom: String,
email: String,
password: {
  min: 4,
  required: true,
  type: String,
},
passwordConfirme: {
  min: 4,
  required: true,
  type: String,
},
role: {
  type: String,
  enum: ["entreprise"],
  default: "entreprise",
},
});

const entrepriseModel = mongoose.model("Entreprise", entrepriseSchema);


module.exports = entrepriseModel;