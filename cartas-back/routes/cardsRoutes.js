const express = require("express");
const router = express.Router();
const cardsController = require("../controllers/cardsController");

router.get("/", cardsController.index);
// router.get("/crear", userController.create);
// router.get("/:id", userController.show);
// router.post("/", userController.store);
// router.get("/editar/:id", userController.edit);
// router.patch("/:id", cardsController.update);
// router.delete("/:id", userController.destroy);

module.exports = router;
