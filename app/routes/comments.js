const express = require("express");
const router = express.Router();
const comments = require("../controller/comments/index");

// v0/hackernews/comments
router.post("/", function (req, res) {
	comments.top_parent_comments(req.body).then((resp) => {
		res.json(resp);
	});
});

module.exports = router;
