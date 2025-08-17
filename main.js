"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeVideoSummary = void 0;
const playwright_extra_1 = require("playwright-extra");
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const async_retry_1 = __importDefault(require("async-retry"));
const fs_1 = __importDefault(require("fs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const OllamaClient_1 = require("./src/Ollama/OllamaClient");
const TranscriptSummarizer_1 = require("./src/TranscriptSummarizer");
const HEADLESS = true;
const YOUTUBE_BASE_URL = 'youtube.com';
const OLLAMA_BASE_PATH = 'http://localhost:11434';
const MODEL = 'gemma3:4b';
const MAX_TOKEN_SIZE = 30000;
const TEMPERATURE = 0;
const OBSIDIAN_FOLDER = 'C:\\Users\\mikey\\Documents\\Obsidian\\Michael Mooney\\Learning Library';
const PLAYLIST = [
    // Artificial Intelligence
    {
        subject: 'Artificial Intelligence',
        title: 'MIT 6.S191- Introduction to Deep Learning',
        url: 'https://www.youtube.com/watch?v=alfdI7S6wCY&list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI',
        start: 1,
    },
    // Sociology
    {
        subject: 'Sociology',
        title: 'Yale - Foundations of Modern Social Thought ',
        url: 'https://www.youtube.com/watch?v=hd33BahdAjs&list=PLDF7B08FF8564D1FE',
        start: 1,
    },
    // Systems Thinking
    /*
    {
      subject: "Systems Thinking",
      title: "IIT Bombay - Introduction to System Dynamics Modeling",
      url: "https://www.youtube.com/watch?v=KP9DxkEBgqg&list=PLOzRYVm0a65fFQDTWYF4hzo6be81blfHo",
      start: 1
    },
    {
      subject: "Complexity and Systems Science",
      title: "MIT 18.404J - Theory of Computation",
      url: "https://www.youtube.com/watch?v=9syvZr-9xwk&list=PLUl4u3cNGP60_JNv2MmK3wkOt9syvfQWY",
      start: 1
    },
    {
      subject: "Complexity and Systems Science",
      title: "CMU - Undergrad Complexity",
      url: "https://www.youtube.com/watch?v=RxhpiYKFQd8&list=PLm3J0oaFux3YL5vLXpzOyJiLtqLp6dCW2",
      start: 27
    },
    {
      subject: "Complexity and Systems Science",
      title: "CMU - Graduate Complexity Theory",
      url: "https://www.youtube.com/watch?v=pRnnEOAQZF8&list=PLm3J0oaFux3b8Gg1DdaJOzYNsaXYLAOKH",
      start: 1
    },
    {
      subject: "Complexity and Systems Science",
      title: "University of Cambridge - Computational Complexity and Quantum Compuation",
      url: "https://www.youtube.com/watch?v=wD-VqXtFdxM&list=PLnQ0eTL7xArjPLt1Zy-zERKX3IuYId2s_",
      start: 1
    },
    {
      subject: "Complexity and Systems Science",
      title: "Cornell - Nonlinear Dynamics and Chaos",
      url: "https://www.youtube.com/watch?v=ycJEoqmQvwg&list=PLbN57C5Zdl6j_qJA-pARJnKsmROzPnO9V",
      start: 1
    },
    {
      subject: "Complexity and Systems Science",
      title: "MIT - Metacomplexity",
      url: "https://www.youtube.com/watch?v=rpLt2_RbrYM&list=PLKVCRT3MRed7d05URwQ9xVFF5qdfHxUxc",
      start: 1
    },
    {
      subject: "Complexity and Systems Science",
      title: "Georgia Tech CS4510 - Automata and Complexity",
      url: "https://www.youtube.com/watch?v=ycJEoqmQvwg&list=PLbN57C5Zdl6j_qJA-pARJnKsmROzPnO9V",
      start: 1
    },
    // Cognitive Science
    {
      subject:"Cognitive Science",
      title: "MIT 9.00 - Introduction To Psychology",
      url: "https://www.youtube.com/watch?v=jQdf2XgbLZo&list=PLUl4u3cNGP615Y1j9Ok3szAH5DxhFjTHo",
      start: 1
    },
    {
      subject: "Cognitive Science",
      title: "MIT 9.00SC - Introduction to Psychology",
      url: "https://www.youtube.com/watch?v=2fbrl6WoIyo&list=PL44ABC9278E2EE706",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "MIT 9.01 - Neuroscience and Behavior",
      url: "https://www.youtube.com/watch?v=XS1SEINTLy0&list=PLsJgl3PUuBJ0Kww3D8TkpntNAIOEflRjg",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "MIT 9.13 - The Human Brain",
      url: "https://www.youtube.com/watch?v=ba-HMvDn_vU&list=PLUl4u3cNGP60IKRN_pFptIBxeiMc0MCJP",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "MIT 9.14 - Brain Structure and Its Origins",
      url: "https://www.youtube.com/watch?v=Qn7WPvap3Zo&list=PLUl4u3cNGP62ABe0O-0qtaHHxyKQi1ZwR",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "MIT 9.20 - Animal Behavior",
      url: "https://www.youtube.com/watch?v=CqJkz9SfGk4&list=PLUl4u3cNGP63TbPEWYEKOq8yAN8mEP_5O",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "MIT 9.40 - Introduction to Neural Computation",
      url: "https://www.youtube.com/watch?v=PnJEj6TokDA&list=PLUl4u3cNGP61I4aI5T6OaFfRK2gihjiMm",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "Prof. Dr. David Tomasi - Psychology of Consciousness",
      url: "https://www.youtube.com/watch?v=ct4jqbYy2H8&list=PLVrDMdxssIRbyDljslcSmzcZ3XSJR1IdN",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "University of Toronto BPM333H1 - Buddhism and Cognitive Science",
      url: "https://www.youtube.com/watch?v=X_mFKePtzV8&list=PLwzqpDoZ6TCKqhjfiXmgxtPB1LLBrBvKd",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "Westfield State University PSYC 101 - Introduction to Psychology",
      url: "https://www.youtube.com/watch?v=a_H1z1JooLM&list=PLWoagukcejEx2ekCL_IH8oE0tSwwYvvtJ",
      start: 1,
    },
    
    {
      subject: "Cognitive Science",
      title: "Westfield State University PSYC 219 - Research I",
      url: "https://www.youtube.com/watch?v=o3jTWRUirVY&list=PLWoagukcejEwxKMXbs_fWTJajvEh_XyhW",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "Westfield State University PSYC 341 - Cognitive Psychology",
      url: "https://www.youtube.com/watch?v=0UueQOs3a2c&list=PLWoagukcejEydDp9oSQiqlviKZr3MdqXt",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "Westfield State University PSYC 356 - Memory",
      url: "https://www.youtube.com/watch?v=coYxAZDJehQ&list=PLWoagukcejEzsUVWwxBZzRnxFtQydsFSQ",
      start: 1,
    },
    {
      subject: "Cognitive Science",
      title: "Westfield State University PSYC 359 - Sensation & Perception",
      url: "https://www.youtube.com/watch?v=JvZjhFW7GlE&list=PLWoagukcejEy2OOGnSIiAAMykzDxf4N5H",
      start: 1,
    },
    */
    // Computer Science
    /*
    {
      subject: "Computer Science",
      title: "Stanford CS224N - Natural Language Processing with Deep Learning",
      url: "https://www.youtube.com/watch?v=DzpHeXVSC5I&list=PLoROMvodv4rOaMFbaqxPDoLWjDaRAdP9D",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS234 - Reinforcement Learning",
      url: "https://www.youtube.com/watch?v=WsvFL-LjA6U&list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS149 - Parallel Computing",
      url: "https://www.youtube.com/watch?v=V1tINV2-9p4&list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp",
      start: 4,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS236 - Deep Generative Models",
      url: "https://www.youtube.com/watch?v=XZ0PMRWXBEU&list=PLoROMvodv4rPOWA-omMM6STXaWW4FvJT8",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS109 - Probability for Computer Scientists",
      url: "https://www.youtube.com/watch?v=2MuDZIAzBMY&list=PLoROMvodv4rOpr_A7B9SriE_iZmkanvUg",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford XCS224U - Natural Language Understanding",
      url: "https://www.youtube.com/watch?v=K_Dh0Sxujuc&list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS229 - Machine Learning",
      url: "https://www.youtube.com/watch?v=Bl4Feh_Mjvo&list=PLoROMvodv4rNyWOpJg_Yh4NSqI4Z4vOYy",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS330 - Deep Multi-Task & Meta Learning",
      url: "https://www.youtube.com/watch?v=bkVCAk9Nsss&list=PLoROMvodv4rNjRoawgt72BBNwL2V7doGI",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS229M - Machine Learning Theory",
      url: "https://www.youtube.com/watch?v=I-tmjGFaaBg&list=PLoROMvodv4rP8nAmISxFINlGKSK4rbLKh",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS221 - Artificial Intelligence",
      url: "https://www.youtube.com/watch?v=ZiwogMtbjr4&list=PLoROMvodv4rOca_Ovz1DvdtWuz8BfSWL2",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS231 - Convolutional Neural Networks",
      url: "https://www.youtube.com/watch?v=Bl4Feh_Mjvo&list=PLoROMvodv4rNyWOpJg_Yh4NSqI4Z4vOYy",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford EE104 - Introduction to Machine Learning",
      url: "https://www.youtube.com/watch?v=jbNVUCRMUP0&list=PLoROMvodv4rN_Uy7_wmS051_q1d6akXmK",
      start: 1,
    },
    {
      subject: "Computer Science",
      title: "Stanford CS230 - Deep Learning",
      url: "https://www.youtube.com/watch?v=PySo_6S4ZAg&list=PLoROMvodv4rOABXSygHTsbvUz4G_YQhOb",
      start: 1,
    },
    // Mathematics
    {
      subject: "Mathematics",
      title: "Stanford ENGR108 - Introduction to Applied Linear Algebra",
      url: "https://www.youtube.com/watch?v=oR6G1MUMveE&list=PLoROMvodv4rMz-WbFQtNUsUElIh2cPmN9",
      start: 1,
    },
    // Physics
    {
      subject: "Physics",
      title: "MIT 8.04 Quantum Physics I",
      url: "https://www.youtube.com/watch?v=jANZxzetPaQ&list=PLUl4u3cNGP60cspQn3N9dYRPiyVWDd80G",
      start: 1,
    },
    // Philosophy
    {
      subject: "Philosophy",
      title: "Bhikkhu Bodhi - Introduction to Buddhism",
      url: "https://www.youtube.com/watch?v=k1WtpnRDx6M&list=PL87WdHjb9rqU3hdbwLCE_9qwsGUq3IfEg",
      start: 1,
    },
    {
      subject: "Philosophy",
      title: "Fayetteville University - Critical Thinking",
      url: "https://www.youtube.com/watch?v=k1WtpnRDx6M&list=PL87WdHjb9rqU3hdbwLCE_9qwsGUq3IfEg",
      start: 1,
    },
    {
      subject: "Philosophy",
      title: "Teaching Company - The Great Minds of the Western Intellectual Tradition",
      url: "https://www.youtube.com/watch?v=8ZoQ7wh9pSQ&list=PL30RAv-0lkxGh5iMfRmZV8wEVeN50K06X",
      start: 1,
    },
    {
      subject: "Philosophy",
      title: "The Royal Institute of Philosophy - Metaphysics",
      url: "https://www.youtube.com/watch?v=vHpKePVXWlA&list=PLdLiRaajwSXSCRO9OwI0M9kfgcsPwq4gH",
      start: 1,
    },
    {
      subject: "Philosophy",
      title: "University of Oxford - Learning from Chinese Philosophy",
      url: "https://www.youtube.com/watch?v=t1URTKw_450&list=PLFZtry6b0WR7o6UF9_7jZwW_YtptlDm8P",
      start: 1,
    },
    {
      subject: "Philosophy",
      title: "UT Austin PHL 301 - Introduction to Philosophy",
      url: "https://www.youtube.com/watch?v=twUpQx87CgE&list=PLzWd5Ny3vW3TmAbJH3fYMRjNUptY0uPW8",
      start: 1,
    },
    {
      subject: "Philosophy",
      title: "Yale University - Philosophy & the Science of Human Nature",
      url: "https://www.youtube.com/watch?v=mUHYlyacMmA&list=PL3F6BC200B2930084",
      start: 1,
    },
    // Biology
    {
      subject: "Biology",
      title: "MIT 7.016 - Introduction to Biology",
      url: "https://www.youtube.com/watch?v=KlVHqq38KJU&list=PLUl4u3cNGP63LmSVIVzy584-ZbjbJ-Y63",
      start: 1,
    },
    // History
    {
      subject: "History",
      title: "Yale University CLCV 205 - Introduction to Ancient Greek History",
      url: "https://www.youtube.com/watch?v=9FrHGAd_yto&list=PL023BCE5134243987",
      start: 1,
    },
    {
      subject: "History",
      title: "Yale University HIST 210 - The Early Middle Ages",
      url: "https://www.youtube.com/watch?v=ZC8JcWVRFp8&list=PL851F45079A91C3F2",
      start: 1,
    },
    // Lingustics
    {
      subject: "Lingustics",
      title: "MIT 24.900 - Introduction to Linguistics",
      url: "https://www.youtube.com/watch?v=Mvy5hjAWeZw&list=PLUl4u3cNGP63BZGNOqrF2qf_yxOjuG35j",
      start: 1,
    },
    {
      subject: "Lingustics",
      title: "The China International Forum - Cognitive Linguistics",
      url: "https://www.youtube.com/watch?v=i7h1voGS2b8&list=PLez3PPtnpncRMUUCgnaZO2WHdEvWwpkpa",
      start: 1,
    },
    {
      subject: "Lingustics",
      title: "UCLA - Linguistic Theory",
      url: "https://www.youtube.com/watch?v=ZwVIoTQKYj0&list=PLa6MU-5gBvQkjDhBz_LsI8pU6B7AjPgU5",
      start: 1,
    },
    {
      subject: "Lingustics",
      title: "University of Calgary LING201 - Introduction to Linguistics",
      url: "https://www.youtube.com/watch?v=42cHuLHBRI4&list=PL2FP6Uxl9zMsNK6jVhY090e3FBDflTWBq",
      start: 1,
    },
    // Religion
    {
      subject: "Religion",
      title: "Yale University - Introduction to the New Testament",
      url: "https://www.youtube.com/watch?v=dtQ2TS1CiDY&list=PL279CFA55C51E75E0",
      start: 1,
    },
    {
      subject: "Religion",
      title: "Yale University - Introduction to the Old Testament",
      url: "https://www.youtube.com/watch?v=mo-YL-lv3RY&list=PLh9mgdi4rNeyuvTEbD-Ei0JdMUujXfyWi",
      start: 1,
    },
    */
];
console.log(`PLAYLISTS TO SUMMARIZE: ${PLAYLIST.length}`);
/*for (const playlist of PLAYLIST) {
  console.log(playlist.folder);
}*/
class YoutubeVideoSummary {
    constructor(settings) {
        this.ollamaClient = new OllamaClient_1.OllamaClient(settings);
        this.transcriptSummarizer = new TranscriptSummarizer_1.TranscriptSummarizer(this.ollamaClient, settings.maxTokenSize);
    }
    async summarize(url) {
        console.debug('URL: ', url);
        if (url.search('https://') == -1 && url.search('watch?') == -1)
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
exports.YoutubeVideoSummary = YoutubeVideoSummary;
10240;
function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';
    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
}
async function getPlaylistVideos(browser, url) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.waitForLoadState('domcontentloaded');
    console.log('GOTO');
    await page.goto(url, { timeout: 120000 });
    await page.waitForSelector('#secondary-inner');
    const expandPlaylistSelector = page
        .locator('#secondary-inner')
        .getByLabel('Expand');
    if (await expandPlaylistSelector.isVisible()) {
        console.log('CLICK EXPAND');
        expandPlaylistSelector.click();
    }
    console.log('WAIT FOR PLAYLIST TITLE');
    await page.waitForSelector('#secondary-inner #header-description .yt-formatted-string');
    console.log('GET PLAYLIST TITLE');
    const playlistTitleSelector = page.locator('#secondary-inner #header-description .yt-formatted-string');
    const playlistTitleElements = await playlistTitleSelector.all();
    const playlistTitle = await playlistTitleElements[0].textContent();
    console.log(`PLAYLIST TITLE: ${playlistTitle}`);
    console.log('WAIT FOR PLAYLIST');
    await page.waitForSelector('#playlist-items.ytd-playlist-panel-renderer');
    console.log('PLAYLIST URLS LOCATOR');
    const elemPlaylistUrls = page.locator('#playlist-items.ytd-playlist-panel-renderer > #wc-endpoint.ytd-playlist-panel-video-renderer');
    console.log('ALL PLAYLIST URLS');
    const allPlaylistUrls = await elemPlaylistUrls.all();
    console.log('PLAYLIST TITLES LOCATOR');
    const elemPlaylistTitles = page.locator('#playlist-items.ytd-playlist-panel-renderer > #wc-endpoint #video-title');
    console.log('ALL PLAYLIST TITLES');
    const allPlaylistTitles = await elemPlaylistTitles.all();
    const playlistTitlesAndUrls = [];
    for (let i = 0; i < allPlaylistTitles.length; i++) {
        let title = await allPlaylistTitles[i].getAttribute('title');
        let url = await allPlaylistUrls[i].getAttribute('href');
        playlistTitlesAndUrls.push([title, url]);
    }
    await page.close();
    return playlistTitlesAndUrls;
}
async function main(browser) {
    const summarizer = new YoutubeVideoSummary({
        ollamaModel: MODEL,
        ollamaUrl: OLLAMA_BASE_PATH,
        maxTokenSize: MAX_TOKEN_SIZE,
        temperature: TEMPERATURE,
    });
    for (const data of PLAYLIST) {
        console.log(`LOAD VIDEO URLS: ${data['url']}`);
        const playlistTitleAndVideoUrls = await (0, async_retry_1.default)(async () => {
            return getPlaylistVideos(browser, data['url'])
                .then((data) => data)
                .catch((error) => {
                console.log(error);
                throw error;
            });
        }, { retries: 100000, maxTimeout: 30000 });
        if (playlistTitleAndVideoUrls === null) {
            console.log('LOAD VIDEO URLS ERROR');
            continue;
        }
        const subject = data['subject'];
        const mainTitle = data['title'];
        const subjectFolder = `${OBSIDIAN_FOLDER}\\${subject}`;
        if (!fs_1.default.existsSync(subjectFolder)) {
            fs_1.default.mkdirSync(subjectFolder);
        }
        const completeFolder = `${subjectFolder}\\${mainTitle}`;
        if (!fs_1.default.existsSync(completeFolder)) {
            fs_1.default.mkdirSync(completeFolder);
        }
        console.log(`FOLDER: ${completeFolder}`);
        console.log(`LOADED VIDEO URLS: ${playlistTitleAndVideoUrls.length}`);
        for (let i = data['start'] - 1; i < playlistTitleAndVideoUrls.length; i++) {
            const url = `https://www.${YOUTUBE_BASE_URL}${playlistTitleAndVideoUrls[i][1]}`;
            console.log(`VIDEO ${i + 1} OUT OF ${playlistTitleAndVideoUrls.length}`);
            let title = playlistTitleAndVideoUrls[i][0]
                ?.replace(/[/\\?%*:|"<>]/g, '-')
                .replace('#', '') ?? 'No title';
            /*
            const numberAtFront = title.match(/^[0-9]{1,2}\.([0-9]{1,2})? ?/);
            if (!numberAtFront) {
              title = `${i + 1}. ${title}`;
            }
            */
            const numberAtFront = /^[0-9]{1,2}\.([0-9]{1,2})? ?/;
            title = `${i + 1}. ${title.replace(numberAtFront, '')}`;
            console.log(`TITLE: ${title}`);
            if (url !== null) {
                const summarization = await (0, async_retry_1.default)(async () => {
                    return summarizer
                        .summarize(url)
                        .then((summary) => summary)
                        .catch((error) => {
                        throw error;
                    });
                }, { retries: 3, maxTimeout: 3000 }).catch((error) => {
                    console.log(error);
                });
                if (summarization === null ||
                    summarization === undefined ||
                    summarization === '') {
                    console.log('SUMMARIZATION ERROR');
                    continue;
                }
                // console.log(summarization);
                fs_1.default.writeFileSync(`${completeFolder}\\${title}.md`, `-> [YouTube Video Link](${url})\n\n${summarization}`);
            }
        }
    }
}
(async () => {
    const browser = await playwright_extra_1.chromium
        .use((0, puppeteer_extra_plugin_stealth_1.default)())
        .launch({ headless: HEADLESS });
    await main(browser);
    await browser.close();
})();
