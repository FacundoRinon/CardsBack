const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { expressjwt: checkJwt } = require("express-jwt");

router.post("/login", userController.login);
router.post("/", userController.store);

router.use(checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }));

// router.get("/", userController.index);
// router.get("/crear", userController.create);
router.get("/:id", userController.show);
// router.get("/editar/:id", userController.edit);
router.patch("/", userController.update);
router.patch("/:id", userController.updateTeam);
router.put("/:id", userController.updateUnlocked);
// router.delete("/:id", userController.destroy);

module.exports = router;
