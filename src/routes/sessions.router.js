import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/register", passport.authenticate("register", { failureRedirect: "api/sessions/failregister" }), async (req, res) => {
    res.send({ status: "success", message: "User registered" });
});

router.get("/failregister", (req, res) => {
    console.log("Failed to register");
    res.send({ error: "Failed to register" });
});

router.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "Invalid credentials" });
    req.session.user = {
        name: req.user.name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
    };
    return res.send({ status: "success", payload: req.user });
});

router.get("/faillogin", (req, res) => {
    res.send({ error: "Failed to login" });
});

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/failregister" }), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
});

export default router;