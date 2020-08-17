const keys = require("../../../config/keys");
const caching = require("../../../utils/caching");
const error_handling = require("../../../utils/error_handling");
const rp = require("request-promise");

async function top_parent_comments(data) {
	let resp_data = [];
	try {
		let cache_key = "comments_" + data["id"].toString();
		let result = await caching.get_result(cache_key);

		// To get data from cache, if it's not a test environment
		if (result && result["status"] && process.env.NODE_ENV != "test") {
			resp_data = result["data"];
		} else {
			result = await get_data_from_firebase(data);
			resp_data = result;
		}
		return {
			status: true,
			message:
				"Top 10 parent comments are retirved for the requested story",
			data: resp_data,
		};
	} catch (err) {
		return error_handling.transform_exception(err);
	}
}

// Function to get story and it's comments data from hacker news
async function get_data_from_firebase(data) {
	var options = {
		method: "GET",
		uri:
			keys.hackernew_base_url +
			"/item/" +
			data["id"].toString() +
			".json",
	};
	let story_details = await rp(options);
	let resp = [];
	if (story_details) {
		story_details = JSON.parse(story_details);
		if (story_details && "kids" in story_details) {
			resp = story_details["kids"];
		}
	}
	var request_options = [];
	for (let each_comments of resp) {
		options = {
			method: "GET",
			uri:
				keys.hackernew_base_url +
				"/item/" +
				each_comments.toString() +
				".json",
			json: true,
		};
		request_options.push(rp(options));
	}

	let results = await Promise.all(request_options);
	results = transform_response(results, data, "comments");
	results = await attach_user_details(results, data);
	return results;
}

function transform_response(results, data, type) {
	let all_users = {};
	let all_comments = [];
	if (type == "user") {
		// block to calculate and set age in years
		for (let each_user of results) {
			let curr_time = Math.floor(new Date().getTime() / 1000);
			let years = Math.round(
				Math.floor((curr_time - each_user["created"]) / 31557600)
			);
			if (years == 0) {
				years =
					Math.round(
						Math.floor((curr_time - each_user["created"]) / 86400)
					).toString() + " days";
			} else {
				years = years.toString() + " years";
			}
			all_users[each_user["id"]] = {
				age_in_years: years,
			};
		}

		for (let each_comments of data) {
			let obj = each_comments;
			obj["age"] =
				all_users && obj["user"] in all_users
					? all_users[obj["user"]]["age_in_years"]
					: 0;
			all_comments.push(obj);
		}
	} else {
		// logic to sort by child comments count
		for (let each_comments of results) {
			let each_obj = {
				text: each_comments["text"],
				user: each_comments["by"],
				kids_len:
					each_comments && "kids" in each_comments
						? each_comments["kids"].length
						: 0,
			};
			all_comments.push(each_obj);
		}
		all_comments.sort(
			(a, b) => parseFloat(b.kids_len) - parseFloat(a.kids_len)
		);
		all_comments = all_comments.slice(0, data["size"]);
	}
	return all_comments;
}

// Function to get user details of each comment and caching the result
async function attach_user_details(comments, data) {
	var request_options = [];
	for (let each_comments of comments) {
		let options = {
			method: "GET",
			uri:
				keys.hackernew_base_url +
				"/user/" +
				each_comments["user"] +
				".json",
			json: true,
		};
		request_options.push(rp(options));
	}

	let results = await Promise.all(request_options);
	results = transform_response(results, comments, "user");
	let resp_data = {};
	resp_data["comments_" + data["id"].toString()] = results;
	caching.set_result(resp_data);
	return results;
}

module.exports = {
	top_parent_comments,
};
