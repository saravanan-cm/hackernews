const Validator = require("validator");
function validate_top_stories_req(data) {
	let errors = {};
	// Email checks
	// if (Validator.isEmpty(data.email)) {
	// 	errors.email = "Email field is required";
	// } else if (!Validator.isEmail(data.email)) {
	// 	errors.email = "Email is invalid";
	// }
	return {
		errors,
		isValid: errors && Object.keys(errors).length ? false : true,
	};
}

function validate_comment_req(data) {
	return {
		errors,
		isValid: true,
	};
}

module.exports = { validate_top_stories_req, validate_comment_req };
