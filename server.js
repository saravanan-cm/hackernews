const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./app/routes/index");
const cors = require("cors");
const app = express();

// Bodyparser middleware
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());

app.use(cors());

// Defining base route
app.use("/v0", routes);

// Setting the NODE_ENV as prod if it's not there to skip caching logic.
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = "prod";
}

const port = process.env.PORT || 5000;
app.listen(port, () =>
	console.log(
		`Yay, Paytm-Hackernews application is running on port ${port} !`
	)
);
