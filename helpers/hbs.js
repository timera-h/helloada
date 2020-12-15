const hbs = require("hbs");
const moment = require("moment");

// CUSTOM HELPERS

hbs.registerHelper("toto", function(number) {
  return number === 0 ? "la tête à toto" : "pas la tête à toto";
});

/*
function ci-dessous: ajoute un opérateur ternaire dans les template hbs
ex usage : {{ ternary true "yay" "nay " }} => affiche yay
ex usage : {{ ternary NaN "yay" "nay " }} => affiche nay
*/
hbs.registerHelper("ternary", (test, yes, no) => (test ? yes : no));

/* 
function ci-dessous, ajoute un opérateur de comparaison dans les template hbs

ex usage :

{{#compare 1 "1" operator="==" }}
 oui 1 est bien égal à "1" en comparaison souple !!!
{{/compare }}

{{#compare 1 10 operator="<" }}
  oui, 1 vaut moins que 10 !!!
{{/compare }}
*/

hbs.registerHelper("compare", function(lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

  var operator = options.hash.operator || "==";

  var operators = {
    "==": function(l, r) {
      return l == r;
    },
    "===": function(l, r) {
      return l === r;
    },
    "!=": function(l, r) {
      return l != r;
    },
    "<": function(l, r) {
      return l < r;
    },
    ">": function(l, r) {
      return l > r;
    },
    "<=": function(l, r) {
      return l <= r;
    },
    ">=": function(l, r) {
      return l >= r;
    },
    typeof: function(l, r) {
      return typeof l == r;
    }
  };

  if (!operators[operator])
    throw new Error(
      "Handlerbars Helper 'compare' doesn't know the operator " + operator
    );

  var result = operators[operator](lvalue, rvalue);

  if (result) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

// ex usage : {{setCheckedbox "user" user.role }}
hbs.registerHelper("setCheckedbox", function(checkboxValue, searchedValue) {
  return checkboxValue.toString() === searchedValue.toString() ? "checked" : "";
});

// ex usage : {{setSelected this._id ../product.category}}
hbs.registerHelper("setSelected", function(optionValue, searchedValue) {
  return optionValue.toString() === searchedValue.toString() ? "selected" : "";
});

/**
 * fonction ci-dessous permet de formater les dates mongo en date lisible par l'utilisateur
 */
hbs.registerHelper("format-date", function(rule) {
  if (!rule) rule = "YYYY-MM-DD";
  return moment(date).format(rule);
});

