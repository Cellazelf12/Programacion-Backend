import { Router } from "express";
import userModel from "../DAOs/models/users.model.js";
const router = Router();

router.post("/register", async (req, res) => {
    const { name, email, age, password } = req.body;
    const exist = await userModel.findOne({ email });

    if (exist || email == "adminCoder@coder.com") {
        return res.status(400).send({ status: "error", message: "User already exists" });
    }

    let user = await userModel.create({ name, email, age, password, role: "usuario" });
    console.log(user)
    res.send({ status: "ok", message: "User created", data: user });
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
        req.session.user = {
            name: "Coder",
            email: email,
            edad: 0,
            role: "admin"
        };
        return res.send({ status: "success", message: req.session.user });
    }
    const user = await userModel.findOne({ email: email, password: password });
    console.log(user)
    if (!user) return res.redirect('/api/login')
    req.session.user = {
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role
    };
    return res.send({ status: "success", message: req.session.user });
});

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

export default router;