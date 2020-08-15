var router = require("express").Router();

// Defining nested route based on module type
router.use("/stories", require("./stories"));
router.use("/comments", require("./comments"));

module.exports = router;
