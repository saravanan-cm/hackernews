const nock = require("nock");
const keys = require("../config/keys");
const story_index = require("../app/controller/stories/index");
const comments_index = require("../app/controller/comments/index");
const responses = require("./response");

describe("Top stories API test cases", () => {
	const OLD_ENV = process.env;
	beforeEach(() => {
		process.env = { ...OLD_ENV }; // Make copy of old envs
	});

	afterAll((done) => {
		nock.cleanAll;
		process.env = OLD_ENV; // Restore old envs
		done();
	});

	afterEach(() => {
		nock.cleanAll;
		nock.restore;
	});

	// Test case to check the success response
	it("Should return top stories with correct data keys after API calls", async (done) => {
		nock(keys.hackernew_base_url)
			.get("/topstories.json")
			.reply(200, responses.topstories);
		for (let i = 0; i < responses.topstories.length; i++) {
			let resp = responses.story_item[i];
			resp["id"] = responses.topstories[i];
			nock(keys.hackernew_base_url + "/item")
				.get("/" + responses.topstories[i].toString() + ".json")
				.reply(200, resp);
		}
		story_index
			.top_stories({
				size: 10,
			})
			.then((top_stories_res) => {
				expect(top_stories_res.status).toEqual(true);
				expect(typeof top_stories_res.data).toEqual("object");
				done();
			});
	});

	// Test case to check the success response
	it("Should return top stories with correct data keys from cache", async (done) => {
		process.env.NODE_ENV = "prod";
		story_index
			.top_stories({
				size: 10,
			})
			.then((top_stories_res) => {
				expect(top_stories_res.status).toEqual(true);
				expect(typeof top_stories_res.data).toEqual("object");
				done();
			});
	});

	// Test case to verify the failure scenario. So just defining first api with response as 500.
	it("Should return proper message with status as false", async (done) => {
		nock(keys.hackernew_base_url).get("/topstories.json").reply(500, {});
		story_index
			.top_stories({
				size: 10,
			})
			.then((top_stories_res) => {
				expect(top_stories_res.status).toEqual(false);
				expect(typeof top_stories_res.message).toBe("string");
				done();
			});
	});
});

describe("Past stories API test cases", () => {
	const OLD_ENV = process.env;
	beforeEach(() => {
		process.env = { ...OLD_ENV }; // Make copy of old envs
	});

	afterAll((done) => {
		nock.cleanAll;
		process.env = OLD_ENV; // Restore old envs
		done();
	});

	afterEach(() => {
		nock.cleanAll;
		nock.restore;
	});

	// Test case to check the success response
	it("Should return past stories with correct data keys from cache", async (done) => {
		process.env.NODE_ENV = "prod";
		story_index.past_stories().then((top_stories_res) => {
			expect(top_stories_res.status).toEqual(true);
			expect(typeof top_stories_res.data).toEqual("object");
			done();
		});
	});
});

describe("Top parent comments API test cases", () => {
	const OLD_ENV = process.env;
	beforeEach(() => {
		process.env = { ...OLD_ENV }; // Make copy of old envs
	});

	afterAll((done) => {
		nock.cleanAll;
		process.env = OLD_ENV; // Restore old envs
		done();
	});

	afterEach(() => {
		nock.cleanAll;
		nock.restore;
	});

	// Test case to check the success response
	it("Should return top comments with success data after API calls", async (done) => {
		nock(keys.hackernew_base_url + "/item")
			.get("/" + responses.id.toString() + ".json")
			.reply(200, responses.story_item[0]);
		for (let i = 0; i < responses.story_item[0].kids.length; i++) {
			let id = responses.story_item[0].kids[i];
			let resp = responses.comments;
			resp["parent"] = id;
			nock(keys.hackernew_base_url + "/item")
				.get("/" + id.toString() + ".json")
				.reply(200, resp);
			nock(keys.hackernew_base_url + "/user")
				.get("/saravanan.json")
				.reply(200, responses.user);
		}
		comments_index
			.top_parent_comments({
				id: responses.id,
			})
			.then((top_comments_res) => {
				expect(top_comments_res.status).toEqual(true);
				expect(typeof top_comments_res.data).toEqual("object");
				done();
			});
	});

	// Test case to check the success response
	it("Should return top comments with correct data keys from cache", async (done) => {
		process.env.NODE_ENV = "prod";
		comments_index
			.top_parent_comments({
				id: responses.id,
			})
			.then((top_comments_res) => {
				expect(top_comments_res.status).toEqual(true);
				expect(typeof top_comments_res.data).toEqual("object");
				done();
			});
	});

	// Test case to verify the failure scenario. So just defining first api with response as 500.
	it("Should return proper message with status as false", async (done) => {
		comments_index.top_parent_comments().then((top_comments_res) => {
			expect(top_comments_res.status).toEqual(false);
			expect(typeof top_comments_res.message).toBe("string");
			done();
		});
	});
});
