let puppeteer = require("puppeteer");
let fs = require("fs");
let url = "";

async function main() {
	try {
		//Create browser
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		page.setViewport({
			width: 1920,
			height: 1080
		});
		await page.goto(url);

		//Click on the button to show more Episodes until theres no button
		//		let button = await page.$(
		//			"a.btn-sm.bg-primary.text-white.text-center"
		//		);
		//				while (button != null) {
		//					await page.click(
		//						"a.btn-sm.bg-primary.text-white.text-center"
		//					);
		//					await page.waitFor(4000);
		//
		//					button = await page.$(
		//						"a.btn-sm.bg-primary.text-white.text-center"
		//					);
		//				}
		//

		//Grab all the hrefs and store it in an array
		const hrefs = await page.evaluate(() =>
			Array.from(
				document.querySelectorAll(".list-group-item"),
				a => a.getAttribute("href")
			)
		);

		let urls = [];

		for (url of hrefs) {
			if (url != null) {
				let urlComplete = "https://animeblix.com" + url;
				urls.push(urlComplete);
			}
		}
		//Organize urls in ascending order
		urls = urls.reverse();

		let videos = [];
		let chapter = 0;

		await page.setRequestInterception(true);

		page.on("request", request => {
			if (request.resourceType() === "media") {
				videos.push([
					request.url(),
					`${animeName}-Episodio-${chapter}`
				]);
			}
			request.continue();
		});

		for (url of urls) {
			chapter += 1;
			await page.goto(url);

			// Test
			//			const buttons = await page.evaluate(() =>
			//				Array.from(
			//					document.querySelectorAll(".btn-cool"),
			//					btn => btn.text
			//				)
			//			);
			//
			//			for (let x = 0; x < buttons.length; x++) {
			//				if (buttons[x] != null) {
			//					buttons[x] = buttons[x].trim();
			//				}
			//			}
			//			if (buttons.includes("Morioh")) {
			//				console.log("Morioh");
			//			} else {
			//				console.log("not found");
			//			}

			await page.waitForSelector(
				"div > .episode__video-options > .btn-toolbar > .btn-group > .btn:nth-child(3)"
			);

			await page.click(
				"div > .episode__video-options > .btn-toolbar > .btn-group > .btn:nth-child(3)"
			);
			await page.waitFor(7000);
		}

		//Save file
		fs.appendFile(`Episodes.txt`, videos, err => {
			if (err) throw err;
			console.log("Episodes save");
		});
	} catch (e) {
		console.log("Our error: ", e);
	}
}
main();
