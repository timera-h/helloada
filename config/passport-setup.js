const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: '876679267917-ujp8psb0f9d2i21ba7m5p0s639cnc333.apps.googleusercontent.com',
        clientSecret: 'Ej1KwmsZno7ucpVgDcE1ZH_Z',
        callbackURL: "http://localhost:8000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }
));


passport.use(new LinkedInStrategy({
        clientID: "77zjbeu061e9gz",
        clientSecret: "39rPtOHXsg7YSKCl",
        callbackURL: "https://localhost:8000/auth/linkedin/callback",
      }, function(accessToken, refreshToken, profile, done) {

          return done(null, profile);
      }));