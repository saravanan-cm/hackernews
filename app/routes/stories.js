const express = require("express");
const router = express.Router();
const stories = require("../controller/stories/index");

// top-stories
router.post("/top-stories", function (req, res) {
	stories.top_stories(req.body).then((resp) => {
		res.json(resp);
	});
});

// past-stories
router.get("/past-stories", function (req, res) {
	stories.past_stories().then((resp) => {
		res.json(resp);
	});
});

module.exports = router;
