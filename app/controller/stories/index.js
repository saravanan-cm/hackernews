const keys = require("../../../config/keys");
const caching = require("../../../utils/caching");
const error_handling = require("../../../utils/error_handling");
const rp = require("request-promise");

async function top_stories(data) {
	let cache_key = "top_stories";
	let resp_data = [];
	try {
		let result = await caching.get_result(cache_key);
		// To get data from cache, if it's not a test environment
		if (result && result["status"] && process.env.NODE_ENV != "test") {
			resp_data = result["data"];
		} else {
			resp_data = await get_data_from_firebase(data);
		}
		return {
			status: true,
			message: "Top stories data successfully retrived",
			data: resp_data,
		};
	} catch (err) {
		return error_handling.transform_exception(err);
	}
}

async function past_stories() {
	let cache_key = "past_stories";
	let resp_data = [];
	try {
		let result = await caching.get_result(cache_key);
		if (result && result["status"]) {
			resp_data = result["data"];
		}
		return {
			status: true,
			message: "Past stories data successfully retrived",
			data: resp_data,
		};
	} catch (err) {
		return error_handling.transform_exception(err);
	}
}

async function get_data_from_firebase(data) {
	let resp = [];
	let options = {
		method: "GET",
		uri: keys.hackernew_base_url + "/topstories.json",
	};
	let story_ids = await rp(options);
	if (story_ids) {
		resp = JSON.parse(story_ids);
	}
	let results = [];
	var request_options = [];
	for (let each_story of resp) {
		options = {
			method: "GET",
			uri:
				keys.hackernew_base_url +
				"/item/" +
				each_story.toString() +
				".json",
			json: true,
		};
		request_options.push(rp(options));
	}
	results = await Promise.all(request_options);
	return transform_response(results, data);
}

function transform_response(results, data) {
	let top_stories_res = [];
	let resp_data = {
		all_stories: results,
	};
	// let curr_time = Math.floor(Date.now() / 1000);
	for (let each_story of results) {
		/* 	If needed to filter for particular duration 
			we can uncomment this condition and 
			send duration in seconds in request
		*/
		// if (curr_time - each_story["time"] <= data["duration"]) {
		let each_obj = {
			id: each_story["id"],
			title: each_story["title"],
			url: each_story["url"],
			score: each_story["score"],
			user: each_story["by"],
			submitted_at: each_story["time"],
		};
		top_stories_res.push(each_obj);
		// }
	}
	top_stories_res.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
	top_stories_res = top_stories_res.slice(0, data["size"]);
	resp_data["top_stories"] = top_stories_res;
	caching.set_result(resp_data);
	caching.get_result("past_stories").then((reply) => {
		if (reply["status"]) {
			reply = reply["data"];
			Array.prototype.push.apply(reply, top_stories_res);
			caching.set_result({
				past_stories: reply,
			});
		}
	});
	return top_stories_res;
}

module.exports = {
	top_stories,
	past_stories,
};
