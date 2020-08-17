function transform_exception(err) {
	return {
		status: false,
		message: err.message,
		data: [],
	};
}

module.exports = { transform_exception };
