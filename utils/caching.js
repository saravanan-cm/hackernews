var asyncRedis = require("async-redis");
var keys = require("../config/keys");

/*  Configuring redis client with default expire for this app. 
    We can move this while setting value for the key also */
var client = asyncRedis.createClient({
	host: keys.redis_host,
	port: keys.redis_port,
	expire: 600,
});

client.get("past_stories").then((reply) => {
	if (!reply) {
		client.set("past_stories", JSON.stringify([]));
	}
});

// Set result in redis
let set_result = (result) => {
	// Redis key to store the response for caching
	// let key = "__paytmsaravanan__" + req.originalUrl || req.url;
	for (let each_key of Object.keys(result)) {
		client.set(each_key, JSON.stringify(result[each_key]));
	}
};

// Get result from redis
async function get_result(key) {
	// Redis key to store the response for caching
	// let key = "__paytmsaravanan__" + req.originalUrl || req.url;
	let reply = await client.get(key);
	if (reply) {
		return {
			status: true,
			data: JSON.parse(reply),
		};
	} else {
		return {
			status: false,
			data: [],
		};
	}
}

module.exports = {
	set_result,
	get_result,
};
