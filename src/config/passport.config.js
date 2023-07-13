import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import userModel from "../DAOs/models/users.model.js"
import { createHash, isValidPassword } from "../utils.js";
import { Strategy as LocalStrategy } from "passport-local";

export const initializePassport = () => {
    passport.use(
        "github",
        new GithubStrategy(
            {
                clientID: "Iv1.240ba93f076ff776",
                clientSecret: "91a25ad35175f4e7d2d7e6ed7bfc7d31f45dfe98",
                callbackURL: "http://localhost:8080/api/sessions/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await userModel.findOne({ email: profile.profileUrl });
                    if (!user) {
                        let newUser = {
                            name: profile.username,
                            email: profile.profileUrl,
                            age: profile.age ? profile.age : 0,
                            role: "user",
                            password: "",
                        };
                        console.log(profile._json);
                        const result = await userModel.create(newUser);
                        done(null, result);
                    } else {
                        done(null, user);
                    }
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { name, email, age } = req.body;
                try {
                    let user = await userModel.findOne({ email: username });
                    if (user) {
                        console.log("User already exists");
                        return done(null, false);
                    }
                    const newUser = {
                        name,
                        email,
                        age,
                        password: createHash(password),
                    };
                    let result = await userModel.create(newUser);
                    return done(null, result);
                } catch (error) {
                    return done("Error al obtener el usuario: " + error);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    console.log("User not found");
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    console.log("Invalid password");
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done("Error al obtener el usuario: " + error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
