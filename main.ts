import { Browser } from "@playwright/test";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import retry from "async-retry";
import fs from "fs";

import { OllamaClient } from "./src/Ollama/OllamaClient";
import { TranscriptSummarizer } from "./src/TranscriptSummarizer";

const HEADLESS = true;
const YOUTUBE_BASE_URL = "youtube.com";
const OLLAMA_BASE_PATH = "http://localhost:11434";
const MODEL = "llama3.1";
const MAX_TOKEN_SIZE = 8192;
const TEMPERATURE = 0;
const OBSIDIAN_FOLDER = "C:\\Users\\[Username]\\Documents\\Learning Library";

const PLAYLIST = [
  {
    subject: "Subject_Folder",
    title: "Title_of_Playlist",
    url: "Youtube_Playlist_URL",
    start: 1, // What video to start on
  },
];
console.log(`PLAYLISTS TO SUMMARIZE: ${PLAYLIST.length}`);
/*for (const playlist of PLAYLIST) {
  console.log(playlist.folder);
}*/

export class YoutubeVideoSummary {
  ollamaClient: OllamaClient;
  transcriptSummarizer: TranscriptSummarizer;

  constructor(settings: {
    ollamaModel: string;
    ollamaUrl: string;
    maxTokenSize: number;
    temperature: number;
  }) {
    this.ollamaClient = new OllamaClient(settings);
    this.transcriptSummarizer = new TranscriptSummarizer(
      this.ollamaClient,
      settings.maxTokenSize
    );
  }

  async summarize(url: string) {
    console.debug("URL: ", url);
    if (url.search("https://") == -1 && url.search("watch?") == -1)
      url = `https://www.${YOUTUBE_BASE_URL}/watch?v=${url}`;

    var start = new Date().getTime();

    return this.transcriptSummarizer
      .getSummaryFromUrl(url)
      .then((summary) => {
        var end = new Date().getTime();
        var time = fancyTimeFormat((end - start) / 1000);
        console.log(`ELAPSED TIME: ${time}`);
        return summary;
      })
      .catch((error) => {
        throw error;
      });
  }
}
10240;

function fancyTimeFormat(duration: number) {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;

  return ret;
}

async function getPlaylistVideos(browser: Browser, url: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.waitForLoadState("networkidle");
  console.log("GOTO");
  await page.goto(url);

  await page.waitForSelector("#secondary-inner");

  const expandPlaylistSelector = page
    .locator("#secondary-inner")
    .getByLabel("Expand");
  if (await expandPlaylistSelector.isVisible()) {
    console.log("CLICK EXPAND");
    expandPlaylistSelector.click();
  }

  console.log("WAIT FOR PLAYLIST TITLE");
  await page.waitForSelector(
    "#secondary-inner #header-description .yt-formatted-string"
  );
  console.log("GET PLAYLIST TITLE");
  const playlistTitleSelector = page.locator(
    "#secondary-inner #header-description .yt-formatted-string"
  );
  const playlistTitleElements = await playlistTitleSelector.all();
  const playlistTitle = await playlistTitleElements[0].textContent();
  console.log(`PLAYLIST TITLE: ${playlistTitle}`);

  console.log("WAIT FOR PLAYLIST");
  await page.waitForSelector("#playlist-items.ytd-playlist-panel-renderer");

  console.log("PLAYLIST URLS LOCATOR");
  const elemPlaylistUrls = page.locator(
    "#playlist-items.ytd-playlist-panel-renderer > #wc-endpoint.ytd-playlist-panel-video-renderer"
  );
  console.log("ALL PLAYLIST URLS");
  const allPlaylistUrls = await elemPlaylistUrls.all();

  console.log("PLAYLIST TITLES LOCATOR");
  const elemPlaylistTitles = page.locator(
    "#playlist-items.ytd-playlist-panel-renderer > #wc-endpoint #video-title"
  );
  console.log("ALL PLAYLIST TITLES");
  const allPlaylistTitles = await elemPlaylistTitles.all();

  const playlistTitlesAndUrls = [];

  for (let i = 0; i < allPlaylistTitles.length; i++) {
    let title = await allPlaylistTitles[i].getAttribute("title");
    let url = await allPlaylistUrls[i].getAttribute("href");
    playlistTitlesAndUrls.push([title, url]);
  }
  await page.close();
  return playlistTitlesAndUrls;
}

async function main(browser: Browser) {
  const summarizer = new YoutubeVideoSummary({
    ollamaUrl: OLLAMA_BASE_PATH,
    maxTokenSize: MAX_TOKEN_SIZE,
    ollamaModel: MODEL,
    temperature: TEMPERATURE,
  });

  for (const data of PLAYLIST) {
    console.log(`LOAD VIDEO URLS: ${data["url"]}`);
    const playlistTitleAndVideoUrls = await retry(
      async () => {
        return getPlaylistVideos(browser, data["url"])
          .then((data) => data)
          .catch((error) => {
            console.log(error);
            throw error;
          });
      },
      { retries: 100000, maxTimeout: 30000 }
    );
    if (playlistTitleAndVideoUrls === null) {
      console.log("LOAD VIDEO URLS ERROR");
      continue;
    }
    const subject = data["subject"];
    const mainTitle = data["title"];
    const subjectFolder = `${OBSIDIAN_FOLDER}\\${subject}`;
    if (!fs.existsSync(subjectFolder)) {
      fs.mkdirSync(subjectFolder);
    }
    const completeFolder = `${subjectFolder}\\${mainTitle}`;
    if (!fs.existsSync(completeFolder)) {
      fs.mkdirSync(completeFolder);
    }
    console.log(`FOLDER: ${completeFolder}`);

    console.log(`LOADED VIDEO URLS: ${playlistTitleAndVideoUrls.length}`);
    for (let i = data["start"] - 1; i < playlistTitleAndVideoUrls.length; i++) {
      const url = `https://www.${YOUTUBE_BASE_URL}${playlistTitleAndVideoUrls[i][1]}`;

      console.log(`VIDEO ${i + 1} OUT OF ${playlistTitleAndVideoUrls.length}`);

      let title: string =
        playlistTitleAndVideoUrls[i][0]
          ?.replace(/[/\\?%*:|"<>]/g, "-")
          .replace("#", "") ?? "No title";

      /*
      const numberAtFront = title.match(/^[0-9]{1,2}\.([0-9]{1,2})? ?/);
      if (!numberAtFront) {
        title = `${i + 1}. ${title}`;
      }
      */

      const numberAtFront = /^[0-9]{1,2}\.([0-9]{1,2})? ?/;
      title = `${i + 1}. ${title.replace(numberAtFront, "")}`;

      console.log(`TITLE: ${title}`);

      if (url !== null) {
        const summarization = await retry(
          async () => {
            return summarizer
              .summarize(url)
              .then((summary) => summary)
              .catch((error) => {
                throw error;
              });
          },
          { retries: 3, maxTimeout: 3000 }
        ).catch((error) => {
          console.log(error);
        });

        if (
          summarization === null ||
          summarization === undefined ||
          summarization === ""
        ) {
          console.log("SUMMARIZATION ERROR");
          continue;
        }
        // console.log(summarization);
        fs.writeFileSync(
          `${completeFolder}\\${title}.md`,
          `-> [YouTube Video Link](${url})\n\n${summarization}`
        );
      }
    }
  }
}

(async () => {
  const browser = await chromium
    .use(StealthPlugin())
    .launch({ headless: HEADLESS });
  await main(browser);
  await browser.close();
})();
