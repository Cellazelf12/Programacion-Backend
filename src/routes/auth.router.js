import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    if (req.session.user) {
        return res.redirect('api/products')
    }
    res.render("login")
})
router.get("/register", async (req, res) => {
    res.render("register")
})

router.get("/profile", async (req, res) => {
    const user = req.session.user
    if (!user) {
        return res.redirect('/')
    }
    res.render("profile", user)
})

export default router