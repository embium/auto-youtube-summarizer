import { YoutubeVideo, YoutubeVideoContent } from "./Models";
export declare class YoutubeMetadataParser {
    requestHTML(url: string): Promise<undefined>;
    sanitizeString(str: string): string;
    sanitizePodcast(video: YoutubeVideo): YoutubeVideo;
    applyTemplate(video: YoutubeVideo): YoutubeVideoContent;
    metaOG(root: Document, attribute: string, og: string): string;
    loadVideo(root: Document, url: string): Promise<YoutubeVideo>;
    getVideoNote(url: string): Promise<YoutubeVideoContent>;
}
