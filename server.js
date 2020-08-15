const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const routes = require("./app/routes/index");
const cors = require("cors");
const app = express();

// Passport config
require("./config/passport")(passport);

// Bodyparser middleware
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

app.use(cors());

// Defining base route
app.use("/v0", routes);

const port = process.env.PORT || 5050; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
