let FS = require("fs");
let https = require("https");
const Path = require("path");
let Axios = require("axios");
//
//Read file
let episodes = FS.readFileSync("./episodes.txt").toString();

episodes = episodes.split(",");

let videos = [];
let chapters = [];

//Separate video urls from Episodes
for (item of episodes) {
	if (item.includes("mp4")) {
		videos.push(item);
	} else {
		chapters.push(item);
	}
}

//Removing duplicated urls
let noRepeatVideos = [];

for (let x = 0; x < videos.length; x++) {
	if (noRepeatVideos.includes(videos[x]) == false) {
		noRepeatVideos.push(videos[x]);
	}
}

//Removing duplicated urls
let noRepeatChapters = [];

for (let x = 0; x < chapters.length; x++) {
	if (noRepeatChapters.includes(chapters[x]) == false) {
		noRepeatChapters.push(chapters[x]);
	}
}

//Test

let test = ""

//Download first video
async function download() {
	try {

	//	const path = Path.resolve(__dirname, "files", "video.mp4");

		let agent = new https.Agent({ rejectUnauthorized: false });

		const response = await Axios({
			method: "GET",
			url: test,
			responseType: "stream",
			httpsAgent: agent
		});

		response.data.pipe(FS.createWriteStream("video.mp4"));
	} catch (err) {
		console.log(err);
	}
}
download();
